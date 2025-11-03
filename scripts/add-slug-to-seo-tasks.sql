-- Bu betik, `seo_tasks` tablosuna `product_slug` sütununu ekler.
-- Lütfen bu betiği Supabase SQL Editör'ünüzde çalıştırın.

ALTER TABLE seo_tasks
ADD COLUMN IF NOT EXISTS product_slug VARCHAR(255);
