import { useState, useEffect, useCallback } from 'react'
import { Wallet, CheckCircle, Loader, XCircle, Copy, Check, ExternalLink, QrCode, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react'
import QRCode from 'react-qr-code'
import coinImg from '../assets/coin.png'

const API = (import.meta.env.VITE_API_URL || '') + '/api/general/web3'

const LABELS = {
  generate: { amount: 50, title: 'Payment — $50 USDT', desc: 'Coupon Generation Fee' },
  submit:   { amount: 10, title: 'Payment — $10 USDT', desc: 'Coupon Submission Fee' },
  renew:    { amount: 20, title: 'Payment — $20 USDT', desc: 'Coupon Renewal Fee' },
}

const DEFAULT_TREASURY = '0xd7abd5fea1d0acfeca1a776e327cba554a884ba2'
const BSC_CHAIN_ID = '0x38' // 56
const BSC_USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'

export default function Web3PayStep({ type, metadata, onPaid }) {
  const [tab, setTab] = useState('metamask') // 'metamask' | 'manual'
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')
  const [usdtBalance, setUsdtBalance] = useState(null)
  const [bnbBalance, setBnbBalance] = useState(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'connecting' | 'paying' | 'confirming' | 'verifying' | 'paid' | 'error'
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [manualTx, setManualTx] = useState('')
  const [copied, setCopied] = useState(false)
  const [config, setConfig] = useState({
    treasuryWallet: DEFAULT_TREASURY,
    networkName: 'BNB Smart Chain (BSC)',
    chainId: BSC_CHAIN_ID,
    usdtContractAddress: BSC_USDT_ADDRESS,
    amounts: { generate: 50, submit: 10, renew: 20 },
  })

  const label = LABELS[type] || LABELS.generate

  // Fetch Web3 config from backend
  useEffect(() => {
    fetch(`${API}/config`)
      .then(res => res.json())
      .then(data => {
        if (data.treasuryWallet) {
          setConfig(prev => ({ ...prev, ...data }))
        }
      })
      .catch(err => console.warn('Could not fetch Web3 config, using defaults:', err.message))
  }, [])

  // Fetch balances: BEP-20 USDT and native BNB
  const fetchBalances = useCallback(async (acc) => {
    const targetAccount = acc || account
    if (!window.ethereum || !targetAccount) return

    setLoadingBalance(true)
    try {
      // 1. BEP-20 USDT balance: balanceOf(address) -> selector 0x70a08231
      const usdtContract = config.usdtContractAddress || BSC_USDT_ADDRESS
      const toPadded = targetAccount.replace(/^0x/, '').toLowerCase().padStart(64, '0')
      const callData = `0x70a08231${toPadded}`

      const hexBalance = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: usdtContract, data: callData }, 'latest'],
      })

      if (hexBalance && hexBalance !== '0x') {
        const rawWei = BigInt(hexBalance)
        // BSC BEP-20 USDT uses 18 decimals
        const divisor = 10n ** 18n
        const whole = rawWei / divisor
        const fraction = Number((rawWei % divisor) / (10n ** 14n)) / 10000
        const total = Number(whole) + fraction
        setUsdtBalance(total)
      } else {
        setUsdtBalance(0)
      }

      // 2. Native BNB balance for gas
      const hexBnb = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [targetAccount, 'latest'],
      })
      if (hexBnb) {
        const bnbWei = BigInt(hexBnb)
        const divisor = 10n ** 18n
        const whole = bnbWei / divisor
        const fraction = Number((bnbWei % divisor) / (10n ** 14n)) / 10000
        setBnbBalance(Number(whole) + fraction)
      }
    } catch (err) {
      console.warn('Could not fetch wallet balances:', err.message)
    } finally {
      setLoadingBalance(false)
    }
  }, [account, config.usdtContractAddress])

  // Check if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
            fetchBalances(accounts[0])
          }
        })
        .catch(() => {})

      window.ethereum.request({ method: 'eth_chainId' })
        .then(cid => setChainId(cid))
        .catch(() => {})

      const handleAccountsChanged = (accs) => {
        const newAcc = accs[0] || ''
        setAccount(newAcc)
        if (newAcc) fetchBalances(newAcc)
        else {
          setUsdtBalance(null)
          setBnbBalance(null)
        }
      }
      const handleChainChanged = (cid) => {
        setChainId(cid)
        if (account) fetchBalances(account)
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [account, fetchBalances])

  // Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask or use the Manual / QR Code transfer option.')
      setStatus('error')
      return
    }

    setStatus('connecting')
    setError('')
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected')
      }
      setAccount(accounts[0])
      const cid = await window.ethereum.request({ method: 'eth_chainId' })
      setChainId(cid)
      setStatus('idle')
      await fetchBalances(accounts[0])
    } catch (err) {
      setError(err.message || 'Failed to connect MetaMask')
      setStatus('error')
    }
  }

  // Switch to BNB Smart Chain if needed
  const switchNetwork = async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId || BSC_CHAIN_ID }],
      })
      if (account) fetchBalances(account)
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BSC_CHAIN_ID,
              chainName: 'BNB Smart Chain',
              nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com/'],
            }],
          })
          if (account) fetchBalances(account)
        } catch (addError) {
          setError(addError.message)
        }
      } else {
        setError(switchError.message)
      }
    }
  }

  // Send transaction with MetaMask
  const handlePayMetaMask = async () => {
    if (!window.ethereum || !account) {
      await connectWallet()
      return
    }

    // Auto-prompt network switch if connected to a different chain
    if (chainId && config.chainId && parseInt(chainId, 16) !== parseInt(config.chainId, 16)) {
      try {
        await switchNetwork()
      } catch {
        setError('Please switch to BNB Smart Chain to proceed.')
        return
      }
    }

    // Check USDT balance
    if (usdtBalance !== null && usdtBalance < label.amount) {
      setError(`Insufficient USDT balance. You have ${usdtBalance.toFixed(2)} USDT, but $${label.amount} USDT is required. Please fund your wallet.`)
      setStatus('error')
      return
    }

    setStatus('paying')
    setStatusMessage('Waiting for confirmation in MetaMask…')
    setError('')

    try {
      const targetAddress = config.treasuryWallet || DEFAULT_TREASURY
      const amountUsdt = label.amount

      // Standard BEP-20 transfer: transfer(address to, uint256 value) = 0xa9059cbb
      let txParams

      if (config.usdtContractAddress) {
        // BSC BEP-20 USDT uses 18 decimals
        const amountWei = BigInt(Math.round(amountUsdt)) * (10n ** 18n)
        const amountHex = amountWei.toString(16).padStart(64, '0')
        const toClean = targetAddress.replace(/^0x/, '').toLowerCase().padStart(64, '0')
        const data = `0xa9059cbb${toClean}${amountHex}`

        txParams = {
          from: account,
          to: config.usdtContractAddress,
          data,
        }
      } else {
        txParams = {
          from: account,
          to: targetAddress,
          value: '0x0',
        }
      }

      // 1. Prompt MetaMask signature
      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      })

      setTxHash(hash)
      setStatus('confirming')
      setStatusMessage('Confirming transaction on BNB Smart Chain…')

      // 2. Wait for on-chain confirmation (poll receipt)
      let receipt = null
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise(r => setTimeout(r, 2000))
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [hash],
          })
          if (receipt && receipt.blockNumber) break
        } catch {
          // retry
        }
      }

      if (!receipt) {
        throw new Error('Transaction submitted (Tx: ' + hash.slice(0, 10) + '...), but awaiting block confirmation. You can verify below.')
      }

      // If status is 0x0, transaction was reverted on chain
      if (receipt.status !== '0x1') {
        throw new Error('Transaction failed or was reverted on the blockchain. No funds were transferred.')
      }

      // 3. Verified on-chain! Now call backend to execute coupon generation
      setStatus('verifying')
      setStatusMessage('Payment confirmed on-chain! Crediting treasury and generating coupons…')
      await verifyTransaction(hash, account)

    } catch (err) {
      console.error('MetaMask payment error:', err)
      if (err.code === 4001) {
        setError('Transaction was rejected in MetaMask.')
      } else {
        setError(err.message || 'Payment initiation failed.')
      }
      setStatus('error')
    }
  }

  // Verify payment on backend
  const verifyTransaction = useCallback(async (hashToVerify, walletAddr) => {
    setStatus('verifying')
    setStatusMessage('Verifying transaction with Treasury…')
    setError('')
    try {
      const res = await fetch(`${API}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: hashToVerify,
          fromWallet: walletAddr || account || 'web3_user',
          type,
          metadata,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Payment verification failed.')
      }

      setStatus('paid')
      // Refresh balance after deduction
      if (account) fetchBalances(account)

      if (onPaid) {
        onPaid(data.result || {})
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please ensure your transaction is confirmed on BSC.')
      setStatus('error')
    }
  }, [account, type, metadata, onPaid, fetchBalances])

  // Handle manual TxHash submission
  const handleManualVerify = async (e) => {
    e?.preventDefault()
    if (!manualTx.trim()) {
      setError('Please enter a valid transaction hash.')
      return
    }
    await verifyTransaction(manualTx.trim(), account)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(config.treasuryWallet || DEFAULT_TREASURY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : ''

  const isInsufficient = usdtBalance !== null && usdtBalance < label.amount

  if (status === 'paid') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <CheckCircle size={52} color="#27ae60" style={{ marginBottom: 14 }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: '#27ae60' }}>Payment Confirmed & Processed!</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, marginBottom: 12 }}>
          ${label.amount} USDT successfully transferred to the FCFC Treasury.
        </div>
        {txHash && (
          <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            Tx: {shortAddr(txHash)}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="form-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={coinImg} alt="crypto payment" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        {label.title}
      </div>
      <div className="form-subtitle">
        Pay securely using your MetaMask wallet or transfer directly on {config.networkName}.
      </div>

      <div style={{
        background: 'var(--bg)', borderRadius: 16, boxShadow: 'var(--shadow-card)',
        padding: '24px', marginBottom: 24, textAlign: 'center',
      }}>
        {/* Method Tabs */}
        <div style={{
          display: 'inline-flex', background: 'rgba(0,0,0,0.04)', borderRadius: 12,
          padding: 4, marginBottom: 20, gap: 4,
        }}>
          <button
            type="button"
            onClick={() => { setTab('metamask'); setError('') }}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: tab === 'metamask' ? 'var(--navy)' : 'transparent',
              color: tab === 'metamask' ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}
          >
            <Wallet size={15} /> Pay with MetaMask
          </button>
          <button
            type="button"
            onClick={() => { setTab('manual'); setError('') }}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: tab === 'manual' ? 'var(--navy)' : 'transparent',
              color: tab === 'manual' ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}
          >
            <QrCode size={15} /> Direct QR / Manual
          </button>
        </div>

        {/* Amount Card */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--navy)', letterSpacing: -0.5 }}>
            ${label.amount} <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-muted)' }}>USDT</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Network: <strong style={{ color: 'var(--navy)' }}>{config.networkName}</strong>
          </div>
        </div>

        {/* Tab 1: MetaMask One-Click */}
        {tab === 'metamask' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {account ? (
              <div style={{ width: '100%', maxWidth: 440 }}>
                {/* Connected Wallet Info & Balances Box */}
                <div style={{
                  background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 14, padding: '14px 18px', textAlign: 'left', marginBottom: 6,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#27ae60', fontSize: 13, fontWeight: 700 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27ae60' }} />
                      {shortAddr(account)}
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchBalances(account)}
                      title="Refresh balance"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                    >
                      <RefreshCw size={12} className={loadingBalance ? 'adm-spin' : ''} /> Refresh
                    </button>
                  </div>

                  {/* USDT Balance Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '4px 0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>USDT Balance:</span>
                    <strong style={{ color: isInsufficient ? '#e74c3c' : '#27ae60', fontFamily: 'monospace', fontSize: 14 }}>
                      {usdtBalance !== null ? `${usdtBalance.toFixed(2)} USDT` : (loadingBalance ? 'Checking…' : '—')}
                    </strong>
                  </div>

                  {/* BNB Balance Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '2px 0', color: 'var(--text-muted)' }}>
                    <span>BNB (Gas):</span>
                    <span style={{ fontFamily: 'monospace' }}>
                      {bnbBalance !== null ? `${bnbBalance.toFixed(4)} BNB` : '—'}
                    </span>
                  </div>
                </div>

                {/* Insufficient Balance Alert */}
                {isInsufficient && (
                  <div style={{
                    background: 'rgba(231, 76, 60, 0.08)', border: '1px solid rgba(231, 76, 60, 0.25)',
                    borderRadius: 10, padding: '10px 14px', color: '#c0392b', fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', marginBottom: 8,
                  }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Insufficient USDT Balance:</strong> You have <strong>{usdtBalance.toFixed(2)} USDT</strong>, but <strong>${label.amount} USDT</strong> is required.
                    </div>
                  </div>
                )}

                {/* Low BNB gas notice */}
                {bnbBalance !== null && bnbBalance < 0.0005 && (
                  <div style={{ fontSize: 11, color: '#e67e22', marginBottom: 8, textAlign: 'left' }}>
                    ⚠️ Your BNB balance is very low. You will need a small amount of BNB to cover BSC network gas fees.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Connect your MetaMask wallet to verify balance and initiate payment.
              </div>
            )}

            {/* Network Check */}
            {account && chainId && config.chainId && parseInt(chainId, 16) !== parseInt(config.chainId, 16) && (
              <div style={{ fontSize: 12, color: '#e67e22', display: 'flex', alignItems: 'center', gap: 6 }}>
                Wrong network detected.
                <button
                  type="button"
                  onClick={switchNetwork}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Switch to {config.networkName}
                </button>
              </div>
            )}

            {/* Payment Button / Status Actions */}
            {status === 'idle' && (
              !account ? (
                <button
                  type="button"
                  className="neu-btn neu-btn-primary"
                  onClick={connectWallet}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 15 }}
                >
                  <Wallet size={18} /> Connect MetaMask
                </button>
              ) : (
                <button
                  type="button"
                  className="neu-btn neu-btn-primary"
                  onClick={handlePayMetaMask}
                  disabled={isInsufficient || loadingBalance}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', fontSize: 15,
                    opacity: isInsufficient ? 0.6 : 1,
                    cursor: isInsufficient ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isInsufficient ? `Insufficient Balance ($${label.amount} USDT needed)` : `Pay $${label.amount} USDT`} <ExternalLink size={16} />
                </button>
              )
            )}

            {['connecting', 'paying', 'confirming', 'verifying'].includes(status) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Loader size={18} className="adm-spin" /> {statusMessage}
                </div>
                {status === 'confirming' && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Waiting for BSC block validation (takes ~3 seconds)…
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manual / QR Code */}
        {tab === 'manual' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440 }}>
              Scan the QR code or copy the FCFC Treasury address to transfer <strong>${label.amount} USDT</strong> on <strong>{config.networkName}</strong>.
            </div>

            {/* QR Code */}
            <div style={{
              background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              display: 'inline-block',
            }}>
              <QRCode value={config.treasuryWallet || DEFAULT_TREASURY} size={150} />
            </div>

            {/* Address Box */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.03)',
              padding: '10px 16px', borderRadius: 10, maxWidth: '100%',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', color: 'var(--navy)', fontWeight: 600 }}>
                {config.treasuryWallet || DEFAULT_TREASURY}
              </span>
              <button
                type="button"
                className="neu-btn"
                onClick={copyAddress}
                style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, flexShrink: 0 }}
              >
                {copied ? <Check size={13} color="#27ae60" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Submit TxHash Form */}
            <form onSubmit={handleManualVerify} style={{ width: '100%', maxWidth: 460, marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, textAlign: 'left' }}>
                Already transferred? Paste your Transaction Hash (TxHash):
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="neu-input"
                  placeholder="0x..."
                  value={manualTx}
                  onChange={e => { setManualTx(e.target.value); setError('') }}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                  disabled={status === 'verifying'}
                />
                <button
                  type="submit"
                  className="neu-btn neu-btn-primary"
                  disabled={status === 'verifying' || !manualTx.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '10px 18px', fontSize: 13 }}
                >
                  {status === 'verifying' ? <Loader size={14} className="adm-spin" /> : <ShieldCheck size={15} />}
                  Verify
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Notification */}
        {status === 'error' && (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e74c3c', fontSize: 13, fontWeight: 600, maxWidth: 460 }}>
              <XCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
            <button
              type="button"
              className="neu-btn"
              onClick={() => { setStatus('idle'); setError(''); if (account) fetchBalances(account) }}
              style={{ fontSize: 12, padding: '6px 16px' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  )
}
