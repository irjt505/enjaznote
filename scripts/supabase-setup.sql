-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/qvycrzdjvgbopkryudnq/sql/new)

-- 1. Create tables
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

-- 2. Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies for reviews
-- Anyone can insert (for the website form)
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can see all reviews
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (auth.role() = 'authenticated' OR approved = true);

-- Only authenticated users can update/delete
CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. RLS policies for orders
-- Anyone can insert
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view/delete
CREATE POLICY "Admins can view orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
