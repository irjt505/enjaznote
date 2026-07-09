-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/qvycrzdjvgbopkryudnq/sql/new)
-- Adds RLS policies for subscribers and newsletters tables

-- Enable RLS on tables
ALTER TABLE IF EXISTS subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletters ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribers
-- Anyone can insert (for the website subscribe form)
DROP POLICY IF EXISTS "Anyone can insert subscribers" ON subscribers;
CREATE POLICY "Anyone can insert subscribers"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can view subscribers
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;
CREATE POLICY "Admins can view subscribers"
  ON subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update subscribers (for unsubscribe token)
DROP POLICY IF EXISTS "Admins can update subscribers" ON subscribers;
CREATE POLICY "Admins can update subscribers"
  ON subscribers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only authenticated users can delete subscribers
DROP POLICY IF EXISTS "Admins can delete subscribers" ON subscribers;
CREATE POLICY "Admins can delete subscribers"
  ON subscribers FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS policies for newsletters
-- Only authenticated users (admins) can view newsletters
DROP POLICY IF EXISTS "Admins can view newsletters" ON newsletters;
CREATE POLICY "Admins can view newsletters"
  ON newsletters FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can insert newsletters
DROP POLICY IF EXISTS "Admins can insert newsletters" ON newsletters;
CREATE POLICY "Admins can insert newsletters"
  ON newsletters FOR INSERT
  USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);
