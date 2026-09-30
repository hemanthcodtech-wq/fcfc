const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle unexpected idle client errors so the server never crashes when Neon serverless drops idle connections
pool.on('error', (err) => {
  console.warn('⚠️ Neon DB idle connection dropped (auto-handled):', err.message);
});

// Test initial connection and release client back to the pool immediately
pool.connect()
  .then((client) => {
    console.log('✅ Neon DB connected');
    client.release();
  })
  .catch(err => console.error('❌ DB connection error:', err.message));

module.exports = pool;
