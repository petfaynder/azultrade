ALTER TABLE blog_posts
ADD COLUMN related_products JSONB DEFAULT '[]'::jsonb;
