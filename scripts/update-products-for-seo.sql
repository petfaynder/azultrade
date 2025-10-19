-- Step 1: Add new columns for SEO and structured data
ALTER TABLE products
ADD COLUMN IF NOT EXISTS seo_info JSONB,
ADD COLUMN IF NOT EXISTS structured_data JSONB;

-- Step 2: Alter the column type of images to JSONB using a simple cast
-- This will convert a TEXT[] like '{"url1", "url2"}' to a JSONB array like '["url1", "url2"]'
ALTER TABLE products
ALTER COLUMN images TYPE JSONB
USING to_jsonb(images);

-- Step 3: Update the data in the newly typed images column to the desired object structure
-- This transforms '["url1", "url2"]' to '[{"url": "url1", "alt": ""}, {"url": "url2", "alt": ""}]'
-- This command is safe to run even if some rows are already in the new format.
UPDATE products
SET images = (
  SELECT jsonb_agg(jsonb_build_object('url', value, 'alt', ''))
  FROM jsonb_array_elements_text(images)
)
WHERE 
  images IS NOT NULL 
  AND jsonb_typeof(images) = 'array'
  -- Ensure we only transform arrays of strings, not arrays of objects
  AND (SELECT jsonb_typeof(arr_element) FROM jsonb_array_elements(images) arr_element LIMIT 1) = 'string';

-- Add comments to explain the new columns
COMMENT ON COLUMN products.seo_info IS 'Stores SEO-related information like keywords and meta descriptions.';
COMMENT ON COLUMN products.structured_data IS 'Stores JSON-LD structured data for rich snippets in search results.';
COMMENT ON COLUMN products.images IS 'Stores an array of image objects, each with a URL and alt text.';
