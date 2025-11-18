-- First, remove duplicate courier numbers, keeping only the first occurrence
WITH duplicates AS (
  SELECT id, courier_no,
    ROW_NUMBER() OVER (PARTITION BY courier_no ORDER BY created_at) as rn
  FROM orders
  WHERE courier_no IS NOT NULL
)
UPDATE orders
SET courier_no = NULL
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Now add unique constraint to courier_no column to prevent future duplications
ALTER TABLE orders ADD CONSTRAINT unique_courier_no UNIQUE (courier_no);