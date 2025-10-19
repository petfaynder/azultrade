ALTER TABLE products ADD COLUMN slug TEXT UNIQUE;

-- Mevcut ürünler için slug'ları daha sonra bir script ile dolduracağız.
-- Şimdilik sadece sütunu ekliyoruz.