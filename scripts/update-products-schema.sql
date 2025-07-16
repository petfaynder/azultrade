-- Update products table to support multiple images, videos, and PDF documents
ALTER TABLE products 
DROP COLUMN IF EXISTS image;

-- Add new columns for multiple media
ALTER TABLE products 
ADD COLUMN images TEXT[] DEFAULT '{}',
ADD COLUMN videos TEXT[] DEFAULT '{}',
ADD COLUMN pdf_document TEXT;

-- Update existing products to move single image to images array
UPDATE products 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]
  ELSE '{}'
END
WHERE images = '{}';

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN(images);
CREATE INDEX IF NOT EXISTS idx_products_videos ON products USING GIN(videos);
CREATE INDEX IF NOT EXISTS idx_products_pdf ON products(pdf_document) WHERE pdf_document IS NOT NULL;

-- Update sample data with multiple images
UPDATE products 
SET 
  images = ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
  videos = ARRAY['https://www.youtube.com/watch?v=sample1'],
  pdf_document = '/sample-catalog.pdf'
WHERE name = 'Premium Olive Oil Processing Line';

UPDATE products 
SET 
  images = ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=350&width=500', '/placeholder.svg?height=300&width=400'],
  videos = ARRAY[],
  pdf_document = '/industrial-textile-specs.pdf'
WHERE name = 'Industrial Textile Loom';

UPDATE products 
SET 
  images = ARRAY['/placeholder.svg?height=400&width=600'],
  videos = ARRAY['https://www.youtube.com/watch?v=sample2', 'https://www.youtube.com/watch?v=sample3'],
  pdf_document = NULL
WHERE name = 'Stone Cutting Machine';

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
