const router = require('express').Router();
const pool = require('../db');
const { galleryUpload, presentationUpload, cloudinary } = require('../middleware/upload');

// ── STATS ──────────────────────────────────────────────
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [coupons, submissions, transactions, users, revenue, renewed] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM coupons'),
      pool.query('SELECT COUNT(*) FROM submissions'),
      pool.query("SELECT COUNT(*) FROM transactions WHERE status = 'completed'"),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE status = 'completed'"),
      pool.query('SELECT COUNT(*) FROM renewed_coupons'),
    ]);
    res.json({
      couponsCreated:        parseInt(coupons.rows[0].count),
      submittedCoupons:      parseInt(submissions.rows[0].count),
      completedTransactions: parseInt(transactions.rows[0].count),
      totalUsers:            parseInt(users.rows[0].count),
      revenueGenerated:      parseFloat(revenue.rows[0].total),
      renewedCoupons:        parseInt(renewed.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── COUPON DETAIL (with full history) ────────────────
// GET /api/admin/coupon-detail/:code
router.get('/coupon-detail/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();

    const coupon = await pool.query(
      `SELECT *,
        CASE
          WHEN status = 'inactive' THEN 'inactive'
          WHEN (created_at + INTERVAL '30 days') < NOW() THEN 'expired'
          WHEN (created_at + INTERVAL '25 days') < NOW() THEN 'expiring'
          ELSE 'active'
        END AS computed_status,
        (created_at + INTERVAL '30 days') AS expiry_date
       FROM coupons WHERE UPPER(code) = $1`, [code]
    );
    if (coupon.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const renewals = await pool.query(
      `SELECT * FROM renewed_coupons WHERE UPPER(code) = $1 ORDER BY created_at ASC`, [code]
    );

    const submission = await pool.query(
      `SELECT * FROM submissions WHERE UPPER(original_code) = $1 ORDER BY created_at DESC LIMIT 1`, [code]
    );

    // Check if this coupon was generated as a result of a submission (not directly purchased)
    const isSubmissionGenerated = await pool.query(
      `SELECT id, original_code FROM submissions WHERE $1 = ANY(generated_codes)`, [code]
    );

    res.json({
      coupon: coupon.rows[0],
      renewals: renewals.rows,
      submission: submission.rows[0] || null,
      isSubmissionGenerated: isSubmissionGenerated.rows.length > 0,
      parentSubmission: isSubmissionGenerated.rows[0] || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── COUPONS ────────────────────────────────────────────
// GET /api/admin/coupons
router.get('/coupons', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
        CASE
          WHEN c.status = 'inactive' THEN 'inactive'
          WHEN (c.created_at + INTERVAL '30 days') < NOW() THEN 'expired'
          WHEN (c.created_at + INTERVAL '25 days') < NOW() THEN 'expiring'
          ELSE 'active'
        END AS computed_status,
        (c.created_at + INTERVAL '30 days') AS expiry_date,
        CASE WHEN s.id IS NOT NULL THEN true ELSE false END AS is_submission_generated,
        CASE WHEN r.id IS NOT NULL THEN true ELSE false END AS is_renewed,
        sub.id AS submitted_id
      FROM coupons c
      LEFT JOIN submissions s ON c.code = ANY(s.generated_codes)
      LEFT JOIN renewed_coupons r ON UPPER(r.code) = UPPER(c.code)
      LEFT JOIN submissions sub ON UPPER(sub.original_code) = UPPER(c.code)
      ORDER BY c.created_at DESC LIMIT 200
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/coupons/:id
router.delete('/coupons/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coupons WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SUBMISSIONS ────────────────────────────────────────
// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/submissions/:id
router.delete('/submissions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM submissions WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TRANSACTIONS / REVENUE ─────────────────────────────
// GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/transactions/:id  — update status
router.patch('/transactions/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/transactions/:id
router.delete('/transactions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── USERS ──────────────────────────────────────────────
// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── RENEWED COUPONS ────────────────────────────────────
// GET /api/admin/renewed
router.get('/renewed', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM renewed_coupons ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/renewed/:id
router.delete('/renewed/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM renewed_coupons WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GALLERY ────────────────────────────────────────────
// GET /api/admin/gallery
router.get('/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/gallery  (multipart upload)
router.post('/gallery', galleryUpload.single('image'), async (req, res) => {
  const { caption, category } = req.body;
  const image_url = req.file?.path;
  const public_id = req.file?.filename;
  if (!image_url) return res.status(400).json({ error: 'No image uploaded', file: req.file ?? null });
  try {
    const result = await pool.query(
      'INSERT INTO gallery (caption, category, image_url, public_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caption, category, image_url, public_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/gallery/:id
router.patch('/gallery/:id', async (req, res) => {
  const { caption, category, image_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE gallery SET caption = COALESCE($1, caption), category = COALESCE($2, category), image_url = COALESCE($3, image_url) WHERE id = $4 RETURNING *',
      [caption, category, image_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT public_id FROM gallery WHERE id = $1', [req.params.id]);
    if (rows[0]?.public_id) await cloudinary.uploader.destroy(rows[0].public_id).catch(() => {});
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LINKS ──────────────────────────────────────────────
// GET /api/admin/links
router.get('/links', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/links
router.post('/links', async (req, res) => {
  const { title, url, category, color } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO links (title, url, category, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, url, category || 'General', color || '#4A90D9']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/links/:id  — update url (and optionally title/category)
router.patch('/links/:id', async (req, res) => {
  const { title, url, category, color } = req.body;
  try {
    const result = await pool.query(
      'UPDATE links SET title = COALESCE($1, title), url = COALESCE($2, url), category = COALESCE($3, category), color = COALESCE($4, color) WHERE id = $5 RETURNING *',
      [title, url, category, color, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/links/:id
router.delete('/links/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM links WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRESENTATIONS ──────────────────────────────────────
// GET /api/admin/presentations
router.get('/presentations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM presentations ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/presentations  (multipart upload — video or PDF)
router.post('/presentations', presentationUpload.single('file'), async (req, res) => {
  const { title, description, category } = req.body;
  const file_url = req.file?.path;
  const public_id = req.file?.filename;
  const file_type = req.file?.mimetype === 'application/pdf' ? 'pdf' : 'video';
  if (!file_url) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await pool.query(
      'INSERT INTO presentations (title, description, file_url, file_type, public_id, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, file_url, file_type, public_id, category || 'General']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/presentations/:id  (title/description/category only)
router.patch('/presentations/:id', async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE presentations SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category) WHERE id = $4 RETURNING *',
      [title, description, category, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/presentations/:id
router.delete('/presentations/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT public_id, file_type FROM presentations WHERE id = $1', [req.params.id]);
    if (rows[0]?.public_id) {
      const rtype = rows[0].file_type === 'pdf' ? 'raw' : 'video';
      await cloudinary.uploader.destroy(rows[0].public_id, { resource_type: rtype }).catch(() => {});
    }
    await pool.query('DELETE FROM presentations WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
