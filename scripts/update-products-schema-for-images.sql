ALTER TABLE public.products
RENAME COLUMN image TO images;

ALTER TABLE public.products
ALTER COLUMN images TYPE TEXT[] USING ARRAY[images];