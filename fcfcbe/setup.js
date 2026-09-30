const pool = require('./db');

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150),
      email VARCHAR(150) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(150),
      status VARCHAR(30) DEFAULT 'active',
      submitted_from VARCHAR(50),
      verified_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      original_code VARCHAR(50),
      email VARCHAR(150),
      generated_codes TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      email VARCHAR(150),
      coupon VARCHAR(50),
      amount NUMERIC(10,2),
      status VARCHAR(30) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS renewed_coupons (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50),
      wallet VARCHAR(100),
      new_end DATE,
      email VARCHAR(150),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      caption VARCHAR(200),
      category VARCHAR(80),
      image_url TEXT,
      public_id VARCHAR(200),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      url TEXT NOT NULL,
      category VARCHAR(80),
      color VARCHAR(20) DEFAULT '#4A90D9',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS presentations (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      file_url TEXT,
      file_type VARCHAR(20) DEFAULT 'video',
      public_id VARCHAR(200),
      category VARCHAR(80),
      created_at TIMESTAMP DEFAULT NOW()
    );

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
  console.log('✅ Tables created');
  process.exit(0);
}

setup().catch(err => { console.error('❌', err.message); process.exit(1); });
