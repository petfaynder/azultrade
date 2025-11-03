-- Bu betik, SEO görevleri ve ürünlerin SEO metriklerini yönetmek için veritabanı şemasını günceller.
-- Lütfen bu betiği Supabase SQL Editör'ünüzde çalıştırın.

-- `seo_tasks` tablosunu oluşturur. Bu tablo, ürünlerle ilişkili SEO görevlerini saklar.
CREATE TABLE IF NOT EXISTS seo_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255),
    task TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- `products` tablosuna SEO ile ilgili yeni alanlar ekler.
-- Bu alanlar, her ürünün SEO performansını izlemek için kullanılır.
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_blog_content BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS keyword_density REAL DEFAULT 0;

-- `seo_tasks` tablosu için Satır Seviyesi Güvenliği'ni (RLS) etkinleştirir.
-- Bu, verilere kimin erişebileceğini kontrol etmek için önemlidir.
ALTER TABLE seo_tasks ENABLE ROW LEVEL SECURITY;

-- Yöneticilerin (admin) `seo_tasks` tablosu üzerinde tam kontrol sahibi olmasını sağlayan bir politika oluşturur.
CREATE POLICY "Admin can manage SEO tasks" ON seo_tasks 
  FOR ALL USING (true);

-- `seo_tasks` tablosundaki bir kayıt güncellendiğinde `updated_at` alanını otomatik olarak
-- güncelleyen bir trigger (tetikleyici) oluşturur.
-- Bu trigger'ın çalışabilmesi için `update_updated_at_column` fonksiyonunun daha önceden
-- 'scripts/supabase-schema.sql' içinde tanımlanmış olması gerekmektedir.
CREATE TRIGGER update_seo_tasks_updated_at 
  BEFORE UPDATE ON seo_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ÖNEMLİ NOT:
-- Bu betiği çalıştırmadan önce `update_updated_at_column` fonksiyonunun veritabanınızda
-- mevcut olduğundan emin olun. Eğer yoksa, aşağıdaki fonksiyon tanımını da betiğin başına ekleyebilirsiniz:
/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/
