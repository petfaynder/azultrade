-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET views = views + 1, updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET views = views + 1, updated_at = NOW()
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog likes
CREATE OR REPLACE FUNCTION increment_blog_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET likes = likes + 1, updated_at = NOW()
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get statistics
CREATE OR REPLACE FUNCTION get_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_products', (SELECT COUNT(*) FROM products),
        'total_blog_posts', (SELECT COUNT(*) FROM blog_posts),
        'total_views', (SELECT COALESCE(SUM(views), 0) FROM products) + (SELECT COALESCE(SUM(views), 0) FROM blog_posts),
        'featured_posts', (SELECT COUNT(*) FROM blog_posts WHERE featured = true)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
