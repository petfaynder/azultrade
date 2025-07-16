-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  description TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  image TEXT,
  badge VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_role VARCHAR(100) DEFAULT 'Export Specialist',
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read active products" ON products 
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read published blog posts" ON blog_posts 
  FOR SELECT USING (status = 'published');

-- Create policies for admin access (you can modify these based on your auth setup)
CREATE POLICY "Admin can manage products" ON products 
  FOR ALL USING (true);

CREATE POLICY "Admin can manage blog posts" ON blog_posts 
  FOR ALL USING (true);

-- Create functions for incrementing views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET views = views + 1, updated_at = NOW() 
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1, updated_at = NOW() 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_blog_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET likes = likes + 1, updated_at = NOW() 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_stats()
RETURNS TABLE(
  total_products INTEGER,
  total_blog_posts INTEGER,
  total_views INTEGER,
  featured_posts INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM products WHERE status = 'active'),
    (SELECT COUNT(*)::INTEGER FROM blog_posts WHERE status = 'published'),
    (SELECT COALESCE(SUM(views), 0)::INTEGER FROM products WHERE status = 'active') + 
    (SELECT COALESCE(SUM(views), 0)::INTEGER FROM blog_posts WHERE status = 'published'),
    (SELECT COUNT(*)::INTEGER FROM blog_posts WHERE featured = true AND status = 'published');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO products (name, category, manufacturer, price, description, features, image, badge) VALUES
('Premium Olive Oil Processing Line', 'Food Processing', 'Turkish Machinery Co.', '$250,000', 'State-of-the-art olive oil processing equipment with cold press technology', ARRAY['Cold Press Technology', 'Automated Control', 'High Capacity', 'Quality Certification'], '/placeholder.svg?height=400&width=600', 'Best Seller'),
('Industrial Textile Loom', 'Textile Machinery', 'Anatolia Textiles', '$180,000', 'High-speed industrial loom for premium fabric production', ARRAY['High Speed Operation', 'Energy Efficient', 'Low Maintenance', 'Digital Controls'], '/placeholder.svg?height=400&width=600', 'Featured'),
('Stone Cutting Machine', 'Stone Processing', 'Istanbul Stone Tech', '$95,000', 'Precision stone cutting equipment for marble and granite', ARRAY['Precision Cutting', 'Water Cooling System', 'Safety Features', 'Easy Operation'], '/placeholder.svg?height=400&width=600', NULL),
('Ceramic Tile Press', 'Ceramics', 'Bursa Ceramics', '$320,000', 'Advanced hydraulic press for ceramic tile manufacturing', ARRAY['Hydraulic System', 'Automated Loading', 'Quality Control', 'High Productivity'], '/placeholder.svg?height=400&width=600', 'New Arrival'),
('Agricultural Harvester', 'Agricultural Equipment', 'Konya Agriculture', '$450,000', 'Multi-crop harvesting machine with GPS guidance', ARRAY['GPS Guidance', 'Multi-Crop Capability', 'Fuel Efficient', 'Comfortable Cabin'], '/placeholder.svg?height=400&width=600', 'Premium'),
('CNC Milling Machine', 'Industrial Machinery', 'Ankara Precision', '$280,000', 'High-precision CNC milling machine for metal processing', ARRAY['High Precision', 'Multi-Axis Control', 'Tool Changer', 'CAD/CAM Integration'], '/placeholder.svg?height=400&width=600', NULL);

INSERT INTO blog_posts (title, excerpt, content, author, category, tags, image, featured) VALUES
('Turkish Export Market Trends 2024', 'Analysis of the latest trends in Turkish export markets and opportunities for international buyers.', 'The Turkish export market continues to show strong growth across multiple sectors...', 'Mehmet Özkan', 'Market Analysis', ARRAY['exports', 'turkey', 'market-trends', '2024'], '/placeholder.svg?height=300&width=500', true),
('Quality Standards in Turkish Manufacturing', 'Understanding the quality control processes and certifications in Turkish manufacturing.', 'Turkish manufacturers have invested heavily in quality control systems...', 'Ayşe Demir', 'Quality Control', ARRAY['quality', 'manufacturing', 'standards', 'certification'], '/placeholder.svg?height=300&width=500', true),
('Logistics Solutions for Turkish Exports', 'Comprehensive guide to shipping and logistics options for Turkish products.', 'Efficient logistics are crucial for successful international trade...', 'Ali Yılmaz', 'Logistics', ARRAY['logistics', 'shipping', 'export', 'transportation'], '/placeholder.svg?height=300&width=500', false),
('Sustainable Manufacturing in Turkey', 'How Turkish manufacturers are adopting sustainable practices and green technologies.', 'Sustainability has become a key focus for Turkish manufacturers...', 'Fatma Kaya', 'Sustainability', ARRAY['sustainability', 'green-tech', 'manufacturing', 'environment'], '/placeholder.svg?height=300&width=500', true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
