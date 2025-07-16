-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET views = views + 1, updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1, updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog post likes
CREATE OR REPLACE FUNCTION increment_blog_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET likes = likes + 1, updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
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
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get product count for each category
CREATE OR REPLACE FUNCTION get_category_product_counts()
RETURNS TABLE(category_id UUID, product_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS category_id,
    COUNT(p.id) AS product_count
  FROM
    categories c
  LEFT JOIN
    products p ON c.id = p.category_id
  GROUP BY
    c.id;
END;
$$ LANGUAGE plpgsql;
