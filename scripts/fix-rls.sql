-- تشغيل هذا الكود في Supabase SQL Editor
-- Database → SQL Editor → New Query → لصق الكود → Run

-- 1. حذف السياسة القديمة المعطلة
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;

-- 2. إعادة إنشاء السياسة للـ anon role
CREATE POLICY "Anyone can insert reviews" ON reviews
FOR INSERT
TO anon
WITH CHECK (true);

-- 3. التأكد من أن RLS مفعل على الجدول
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
