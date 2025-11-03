CREATE TABLE content_opportunities (
  topic TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  linked_blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON content_opportunities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
