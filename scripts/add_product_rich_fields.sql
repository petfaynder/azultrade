ALTER TABLE products
ADD COLUMN rich_description TEXT,
ADD COLUMN technical_specs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN additional_info JSONB DEFAULT '[]'::jsonb;