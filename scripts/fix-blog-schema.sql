-- Fix blog_posts table - add missing status column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft'));

-- Update existing records to have status
UPDATE blog_posts SET status = 'published' WHERE status IS NULL;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
