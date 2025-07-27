-- Ayarlar tablosunu oluşturur
-- Bu tablo, anahtar-değer çiftleri olarak site genelindeki çeşitli ayarları saklar.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at sütununu otomatik olarak güncelleyen bir trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- settings tablosu için trigger oluştur
-- Bu trigger, bir satır güncellendiğinde updated_at zaman damgasını otomatik olarak ayarlar.
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Başlangıç için bazı varsayılan ayarları ekle (isteğe bağlı)
-- Bu ayarlar, admin panelinde ilk kez görüntülendiğinde varsayılan değerler sağlar.
INSERT INTO settings (key, value) VALUES
('site_title', 'Azul Trade'),
('site_description', 'Global Trade, Simplified.'),
('site_logo_url', '/placeholder-logo.svg'),
('favicon_url', '/favicon.ico'),
('contact_address', '123 Export St, Istanbul, Turkey'),
('contact_phone', '+90 123 456 7890'),
('contact_email', 'info@azultrade.com'),
('social_linkedin', 'https://linkedin.com/company/azultrade'),
('social_twitter', 'https://twitter.com/azultrade'),
('maintenance_mode', 'false'),
('header_scripts', ''),
('footer_scripts', ''),
('contact_form_recipient_email', 'info@azultrade.com'),
('cookie_consent_message', 'This website uses cookies to ensure you get the best experience on our website.')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE settings IS 'Stores key-value pairs for general site settings.';
COMMENT ON COLUMN settings.key IS 'The unique identifier for the setting (e.g., "site_title").';
COMMENT ON COLUMN settings.value IS 'The value of the setting.';
