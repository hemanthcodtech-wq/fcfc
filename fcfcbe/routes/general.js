const router = require('express').Router();
const pool = require('../db');
const crypto = require('crypto');

// Generate a unique coupon code
async function generateUniqueCode() {
  let code, exists;
  do {
    code = 'FCFC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const { rows } = await pool.query('SELECT 1 FROM coupons WHERE code = $1', [code]);
    exists = rows.length > 0;
  } while (exists);
  return code;
}

// GET /api/general/db-test
router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/general/generate-coupon
router.post('/generate-coupon', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  try {
    const code = await generateUniqueCode();
    const result = await pool.query(
      `INSERT INTO coupons (code, email, status, submitted_from, verified_at)
       VALUES ($1, $2, 'active', $3, NOW()) RETURNING *`,
      [code, email, name]
    );
    await pool.query(
      `INSERT INTO transactions (email, coupon, amount, status) VALUES ($1, $2, $3, 'completed')`,
      [email, code, 50]
    );
    res.status(201).json({ code: result.rows[0].code, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/general/search-coupon?code=FCFC-XXXX
router.get('/search-coupon', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'code query param required' });
  try {
    const { rows } = await pool.query(
      `SELECT *,
        CASE
          WHEN (created_at + INTERVAL '30 days') < NOW() THEN 'expired'
          WHEN (created_at + INTERVAL '25 days') < NOW() THEN 'expiring'
          ELSE 'active'
        END AS status
       FROM coupons WHERE UPPER(code) = UPPER($1)`,
      [code.trim()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/general/validate-coupon?code=FCFC-XXXX
router.get('/validate-coupon', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'code required' });
  try {
    const { rows } = await pool.query(
      `SELECT id, code, status FROM coupons WHERE UPPER(code) = UPPER($1)
       AND (created_at + INTERVAL '30 days') > NOW()`,
      [code.trim()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found or expired' });
    if (rows[0].status === 'inactive') return res.status(400).json({ error: 'Coupon is already inactive' });
    res.json({ valid: true, code: rows[0].code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/general/submit-coupon
router.post('/submit-coupon', async (req, res) => {
  const { code, email } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code is required' });
  try {
    // Check coupon exists and is active (not expired)
    const { rows } = await pool.query(
      `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)
       AND (created_at + INTERVAL '30 days') > NOW()`,
      [code.trim()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found or already expired' });
    if (rows[0].status === 'inactive') return res.status(400).json({ error: 'Coupon is already inactive' });

    // Mark original coupon inactive
    await pool.query(`UPDATE coupons SET status = 'inactive' WHERE id = $1`, [rows[0].id]);

    // Generate 3 unique new coupons
    const newCodes = [];
    for (let i = 0; i < 3; i++) {
      const newCode = await generateUniqueCode();
      const result = await pool.query(
        `INSERT INTO coupons (code, email, status, submitted_from, verified_at)
         VALUES ($1, $2, 'active', $3, NOW()) RETURNING code`,
        [newCode, email || rows[0].email, rows[0].submitted_from]
      );
      newCodes.push(result.rows[0].code);
    }

    // Record submission
    await pool.query(
      `INSERT INTO submissions (original_code, email, generated_codes) VALUES ($1, $2, $3)`,
      [rows[0].code, email || rows[0].email, newCodes]
    );
    await pool.query(
      `INSERT INTO transactions (email, coupon, amount, status) VALUES ($1, $2, $3, 'completed')`,
      [email || rows[0].email, rows[0].code, 10]
    );
    res.status(201).json({ newCodes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/general/renew-coupon
router.post('/renew-coupon', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code is required' });
  try {
    const { rows } = await pool.query(
      `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`, [code.trim()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found' });
    if (rows[0].status === 'inactive') return res.status(400).json({ error: 'Inactive coupons cannot be renewed' });

    // Add 30 days on top of the current expiry (created_at + 30 days)
    // e.g. created 5 days ago → expiry was in 25 days → new expiry = 25 + 30 = 55 days from now
    const currentExpiry = new Date(rows[0].created_at).getTime() + 30 * 24 * 60 * 60 * 1000;
    const newExpiry = new Date(currentExpiry + 30 * 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE coupons SET created_at = $1, status = 'active', verified_at = NOW() WHERE id = $2`,
      [newExpiry, rows[0].id]
    );

    await pool.query(
      `INSERT INTO renewed_coupons (code, wallet, new_end, email) VALUES ($1, $2, $3, $4)`,
      [rows[0].code, 'payment', newExpiry.toISOString().split('T')[0], rows[0].email]
    );
    await pool.query(
      `INSERT INTO transactions (email, coupon, amount, status) VALUES ($1, $2, $3, 'completed')`,
      [rows[0].email, rows[0].code, 20]
    );
    res.json({ code: rows[0].code, newExpiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
