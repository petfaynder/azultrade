-- Update products table to support multiple images, videos, and PDF documents
-- First, check if image column exists and handle it properly

-- Add new columns for multiple media if they don't exist
DO $$ 
BEGIN
    -- Add images column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
        ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    -- Add videos column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'videos') THEN
        ALTER TABLE products ADD COLUMN videos TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    -- Add pdf_document column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'pdf_document') THEN
        ALTER TABLE products ADD COLUMN pdf_document TEXT;
    END IF;
END $$;

-- Migrate existing image data if image column exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image') THEN
        -- Update existing products to move single image to images array
        UPDATE products 
        SET images = CASE 
            WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]::TEXT[]
            ELSE ARRAY[]::TEXT[]
        END
        WHERE images = ARRAY[]::TEXT[] OR images IS NULL;
        
        -- Drop the old image column
        ALTER TABLE products DROP COLUMN image;
    END IF;
END $$;

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN(images);
CREATE INDEX IF NOT EXISTS idx_products_videos ON products USING GIN(videos);
CREATE INDEX IF NOT EXISTS idx_products_pdf ON products(pdf_document) WHERE pdf_document IS NOT NULL;

-- Update sample data with multiple images (only if products exist)
UPDATE products 
SET 
    images = ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400']::TEXT[],
    videos = ARRAY['https://www.youtube.com/watch?v=sample1']::TEXT[],
    pdf_document = '/sample-catalog.pdf'
WHERE name ILIKE '%olive%' AND (images = ARRAY[]::TEXT[] OR images IS NULL);

UPDATE products 
SET 
    images = ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=350&width=500', '/placeholder.svg?height=300&width=400']::TEXT[],
    videos = ARRAY[]::TEXT[],
    pdf_document = '/industrial-textile-specs.pdf'
WHERE name ILIKE '%textile%' AND (images = ARRAY[]::TEXT[] OR images IS NULL);

UPDATE products 
SET 
    images = ARRAY['/placeholder.svg?height=400&width=600']::TEXT[],
    videos = ARRAY['https://www.youtube.com/watch?v=sample2', 'https://www.youtube.com/watch?v=sample3']::TEXT[],
    pdf_document = NULL
WHERE name ILIKE '%stone%' AND (images = ARRAY[]::TEXT[] OR images IS NULL);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
