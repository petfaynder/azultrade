-- 1. Remove the existing foreign key and column from content_opportunities
ALTER TABLE content_opportunities DROP COLUMN IF EXISTS linked_blog_post_id;

-- 2. Create a new join table for the many-to-many relationship
CREATE TABLE content_opportunity_blog_posts (
  topic TEXT NOT NULL REFERENCES content_opportunities(topic) ON DELETE CASCADE,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (topic, blog_post_id)
);

-- 3. Update the status logic in the content_opportunities table.
-- The status will now be derived from whether there are linked posts in the new join table.
-- We can handle this in the application logic, but let's ensure the status column is clean.
UPDATE content_opportunities SET status = 'pending';
