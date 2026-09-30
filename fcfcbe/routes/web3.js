const router = require('express').Router();
const crypto = require('crypto');
const pool = require('../db');

const ORDER_CONFIG = {
  generate: { amount: 50, title: 'FCFC Coupon Generation Fee' },
  submit:   { amount: 10, title: 'FCFC Coupon Submission Fee' },
  renew:    { amount: 20, title: 'FCFC Coupon Renewal Fee' },
};

// Helper: Generate unique coupon code
async function generateUniqueCode() {
  let code, exists;
  do {
    code = 'FCFC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const { rows } = await pool.query('SELECT 1 FROM coupons WHERE code = $1', [code]);
    exists = rows.length > 0;
  } while (exists);
  return code;
}

// Ensure web3_orders table exists
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS web3_orders (
        id SERIAL PRIMARY KEY,
        tx_hash VARCHAR(150) UNIQUE NOT NULL,
        from_wallet VARCHAR(150),
        type VARCHAR(20) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PAID',
        metadata JSONB DEFAULT '{}',
        result JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error('Error ensuring web3_orders table:', err.message);
  }
})();

// GET /api/general/web3/config
router.get('/config', (req, res) => {
  const rawChainId = (process.env.CHAIN_ID || '0x38').toString().trim();
  const hexChainId = rawChainId.startsWith('0x') ? rawChainId : '0x' + parseInt(rawChainId, 10).toString(16);

  res.json({
    treasuryWallet: process.env.TREASURY_WALLET_ADDRESS || '0xd7abd5fea1d0acfeca1a776e327cba554a884ba2',
    networkName: process.env.NETWORK_NAME || 'BNB Smart Chain',
    chainId: hexChainId, // BSC Mainnet = 56 (0x38)
    usdtContractAddress: process.env.USDT_CONTRACT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955', // BSC BEP-20 USDT
    amounts: {
      generate: ORDER_CONFIG.generate.amount,
      submit: ORDER_CONFIG.submit.amount,
      renew: ORDER_CONFIG.renew.amount,
    },
  });
});

const BSC_RPC_URLS = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed1.ninicoin.io/',
];

async function callBscRpc(method, params) {
  for (const url of BSC_RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
      });
      const data = await res.json();
      if (data && data.result !== undefined) return data.result;
    } catch {
      // try next RPC
    }
  }
  return null;
}

// Verify transaction on BSC blockchain
async function verifyBscTransaction(txHash, expectedUsdtAmount, treasuryWallet, usdtContract) {
  const receipt = await callBscRpc('eth_getTransactionReceipt', [txHash]);
  if (!receipt) {
    throw new Error('Transaction was not found on Binance Smart Chain yet. Please wait a few moments and try again.');
  }

  // 0x1 = success, 0x0 = reverted / failed
  if (receipt.status !== '0x1') {
    throw new Error('Transaction failed or was reverted on Binance Smart Chain. No funds were transferred.');
  }

  const cleanTreasury = treasuryWallet.toLowerCase().replace(/^0x/, '');
  const cleanUsdt = (usdtContract || '0x55d398326f99059fF775485246999027B3197955').toLowerCase();
  const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

  let validTransferFound = false;

  // 1. Check BEP-20 Transfer logs
  if (Array.isArray(receipt.logs)) {
    for (const log of receipt.logs) {
      if (log.address?.toLowerCase() === cleanUsdt && log.topics?.[0]?.toLowerCase() === transferTopic) {
        const recipientInLog = log.topics[2]?.toLowerCase() || '';
        if (recipientInLog.endsWith(cleanTreasury)) {
          // BSC USDT uses 18 decimals
          const valueWei = BigInt(log.data || '0x0');
          const expectedWei = BigInt(Math.round(expectedUsdtAmount)) * (10n ** 18n);
          if (valueWei >= expectedWei) {
            validTransferFound = true;
            break;
          }
        }
      }
    }
  }

  // 2. Fallback: check if direct BNB transfer was made
  if (!validTransferFound) {
    const tx = await callBscRpc('eth_getTransactionByHash', [txHash]);
    if (tx && tx.to?.toLowerCase() === treasuryWallet.toLowerCase()) {
      validTransferFound = true;
    }
  }

  if (!validTransferFound) {
    throw new Error(
      `Transaction confirmed on BSC, but no valid payment of $${expectedUsdtAmount} USDT to treasury (${treasuryWallet.slice(0, 6)}...${treasuryWallet.slice(-4)}) was found.`
    );
  }

  return receipt;
}

// POST /api/general/web3/verify-payment
// body: { txHash, fromWallet, type: 'generate'|'submit'|'renew', metadata: { name, email, code } }
router.post('/verify-payment', async (req, res) => {
  const { txHash, fromWallet, type, metadata = {} } = req.body;

  if (!txHash || !type) {
    return res.status(400).json({ error: 'Transaction hash and payment type are required.' });
  }

  const config = ORDER_CONFIG[type];
  if (!config) {
    return res.status(400).json({ error: 'Invalid order type' });
  }

  const cleanTxHash = txHash.trim().toLowerCase();

  try {
    // 1. Replay attack check: verify if txHash was already used
    const existing = await pool.query(
      `SELECT * FROM web3_orders WHERE LOWER(tx_hash) = $1`,
      [cleanTxHash]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: 'This transaction hash has already been processed.',
        order: existing.rows[0],
      });
    }

    // 2. On-chain BSC transaction verification
    const treasuryWallet = process.env.TREASURY_WALLET_ADDRESS || '0xd7abd5fea1d0acfeca1a776e327cba554a884ba2';
    const usdtContract = process.env.USDT_CONTRACT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955';
    
    // Only bypass if explicitly set for testing with fake hash in development
    const isTestHash = cleanTxHash.startsWith('test-') && process.env.NODE_ENV !== 'production';
    if (!isTestHash) {
      await verifyBscTransaction(cleanTxHash, config.amount, treasuryWallet, usdtContract);
    }

    let actionResult = {};

    // 2. Business logic execution
    if (type === 'generate') {
      const code = await generateUniqueCode();
      const userEmail = metadata.email || 'customer@fcfc.io';
      const userName = metadata.name || 'User';

      await pool.query(
        `INSERT INTO coupons (code, email, status, submitted_from, verified_at)
         VALUES ($1, $2, 'active', $3, NOW())`,
        [code, userEmail, userName]
      );

      await pool.query(
        `INSERT INTO transactions (email, coupon, amount, status)
         VALUES ($1, $2, $3, 'completed')`,
        [userEmail, code, config.amount]
      );

      actionResult = { code };
    } else if (type === 'submit') {
      if (!metadata.code) {
        return res.status(400).json({ error: 'Original coupon code is required for submission.' });
      }

      const { rows: cRows } = await pool.query(
        `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`,
        [metadata.code.trim()]
      );

      if (cRows.length === 0) {
        return res.status(404).json({ error: 'Coupon code not found.' });
      }
      if (cRows[0].status === 'inactive') {
        return res.status(400).json({ error: 'Coupon is already inactive.' });
      }

      // Deactivate original coupon
      await pool.query(`UPDATE coupons SET status = 'inactive' WHERE id = $1`, [cRows[0].id]);

      // Generate 3 unique replacement coupons
      const newCodes = [];
      for (let i = 0; i < 3; i++) {
        const newCode = await generateUniqueCode();
        await pool.query(
          `INSERT INTO coupons (code, email, status, submitted_from, verified_at)
           VALUES ($1, $2, 'active', $3, NOW())`,
          [newCode, metadata.email || cRows[0].email, cRows[0].submitted_from]
        );
        newCodes.push(newCode);
      }

      await pool.query(
        `INSERT INTO submissions (original_code, email, generated_codes) VALUES ($1, $2, $3)`,
        [metadata.code.trim().toUpperCase(), metadata.email || cRows[0].email, newCodes]
      );

      await pool.query(
        `INSERT INTO transactions (email, coupon, amount, status) VALUES ($1, $2, $3, 'completed')`,
        [metadata.email || cRows[0].email, metadata.code.trim().toUpperCase(), config.amount]
      );

      actionResult = { newCodes };
    } else if (type === 'renew') {
      if (!metadata.code) {
        return res.status(400).json({ error: 'Coupon code is required for renewal.' });
      }

      const { rows: cRows } = await pool.query(
        `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`,
        [metadata.code.trim()]
      );

      if (cRows.length === 0) {
        return res.status(404).json({ error: 'Coupon not found.' });
      }
      if (cRows[0].status === 'inactive') {
        return res.status(400).json({ error: 'Inactive coupons cannot be renewed.' });
      }

      const currentExpiry = new Date(cRows[0].created_at).getTime() + 30 * 24 * 60 * 60 * 1000;
      const newExpiry = new Date(currentExpiry + 30 * 24 * 60 * 60 * 1000);

      await pool.query(
        `UPDATE coupons SET created_at = $1, status = 'active', verified_at = NOW() WHERE id = $2`,
        [newExpiry, cRows[0].id]
      );

      await pool.query(
        `INSERT INTO renewed_coupons (code, wallet, new_end, email) VALUES ($1, $2, $3, $4)`,
        [metadata.code.trim().toUpperCase(), fromWallet || cleanTxHash, newExpiry.toISOString().split('T')[0], metadata.email || cRows[0].email]
      );

      await pool.query(
        `INSERT INTO transactions (email, coupon, amount, status) VALUES ($1, $2, $3, 'completed')`,
        [metadata.email || cRows[0].email, metadata.code.trim().toUpperCase(), config.amount]
      );

      actionResult = { code: metadata.code.trim().toUpperCase(), newExpiry };
    }

    // 3. Save order record in web3_orders
    await pool.query(
      `INSERT INTO web3_orders (tx_hash, from_wallet, type, amount, status, metadata, result)
       VALUES ($1, $2, $3, $4, 'PAID', $5, $6)`,
      [
        cleanTxHash,
        fromWallet || 'web3_user',
        type,
        config.amount,
        JSON.stringify(metadata),
        JSON.stringify(actionResult),
      ]
    );

    res.json({
      success: true,
      txHash: cleanTxHash,
      result: actionResult,
    });
  } catch (err) {
    console.error('Web3 Payment verification error:', err);
    res.status(500).json({ error: err.message || 'Payment processing failed' });
  }
});

// GET /api/general/web3/order-status/:txHash
router.get('/order-status/:txHash', async (req, res) => {
  const { txHash } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM web3_orders WHERE LOWER(tx_hash) = $1`,
      [txHash.trim().toLowerCase()]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
