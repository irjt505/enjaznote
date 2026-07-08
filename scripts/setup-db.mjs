import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const sql = `
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  service_name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  notes TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
`

try {
  await pool.query(sql)
  console.log('✅ Tables created successfully')
} catch (err) {
  console.error('❌ Error:', err)
} finally {
  await pool.end()
}
