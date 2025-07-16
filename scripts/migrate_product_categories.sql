-- Mevcut benzersiz kategori isimlerini categories tablosuna ekle
INSERT INTO categories (name, slug, "order")
SELECT DISTINCT old_category_name,
       LOWER(REPLACE(old_category_name, ' ', '-')),
       0
FROM products
WHERE old_category_name IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- products tablosundaki category_id sütununu güncelle
UPDATE products
SET category_id = c.id
FROM categories c
WHERE products.old_category_name = c.name;

-- old_category_name sütununu kaldır
ALTER TABLE products DROP COLUMN old_category_name;