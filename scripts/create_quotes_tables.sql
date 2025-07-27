-- Teklif Talepleri (Quotes) Tablosu
-- Bu tablo, müşterilerden gelen genel teklif talebi bilgilerini saklar.
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone_number VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- Olası durumlar: pending, processed, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teklif Talebi Kalemleri (Quote Items) Tablosu
-- Bu tablo, her bir teklif talebinde hangi ürünlerden kaç adet istendiğini belirtir.
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teklif taleplerine daha hızlı erişim için indexler
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product_id ON quote_items(product_id);

-- updated_at sütununu otomatik güncelleyen trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- quotes tablosu için trigger
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();