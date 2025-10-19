CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt_text TEXT,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add RLS policies for media_library table
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view media" ON media_library
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert media" ON media_library
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
