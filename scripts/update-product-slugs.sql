-- Bu betik, `products` tablosundaki `slug` alanı boş olan ürünler için
-- `name` alanını kullanarak `slug` oluşturur ve günceller.
-- Lütfen bu betiği Supabase SQL Editör'ünüzde çalıştırın.

-- Geçici bir fonksiyon oluşturarak slugify işlemini yapalım
CREATE OR REPLACE FUNCTION slugify(text)
RETURNS text AS $$
  -- Önce küçük harfe çevir
  WITH normalized AS (
    SELECT lower($1) AS value
  ),
  -- Geçersiz karakterleri tire ile değiştir
  replaced AS (
    SELECT regexp_replace(value, '[^a-z0-9]+', '-', 'g') AS value
    FROM normalized
  ),
  -- Başta ve sonda olabilecek tireleri kaldır
  trimmed AS (
    SELECT regexp_replace(value, '^-|-$', '', 'g') AS value
    FROM replaced
  )
  SELECT value FROM trimmed;
$$ LANGUAGE sql IMMUTABLE;

-- `slug` alanı NULL olan ürünleri güncelle
UPDATE products
SET slug = slugify(name)
WHERE slug IS NULL OR slug = '';

-- Geçici fonksiyonu sil
DROP FUNCTION slugify(text);
