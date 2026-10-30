const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.warn('⚠️ DB client error (auto-handled):', err.message);
});

pool.connect()
  .then((client) => {
    console.log('✅ PostgreSQL connected');
    client.release();
  })
  .catch(err => console.error('❌ DB connection error:', err.message));

module.exports = pool;
