-- Add B2B specific columns to the products table
ALTER TABLE products
ADD COLUMN min_order_quantity VARCHAR(255),
ADD COLUMN country_of_origin VARCHAR(255),
ADD COLUMN supply_ability VARCHAR(255);

-- Add some sample data for existing products
UPDATE products
SET 
  min_order_quantity = '10 Tons',
  country_of_origin = 'Turkey',
  supply_ability = '500 Tons/Month'
WHERE category_id = (SELECT id FROM categories WHERE name = 'Industrial Machinery' LIMIT 1);

UPDATE products
SET 
  min_order_quantity = '100 Units',
  country_of_origin = 'Germany',
  supply_ability = '1000 Units/Week'
WHERE category_id = (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1);

-- You can add more specific updates for other products/categories