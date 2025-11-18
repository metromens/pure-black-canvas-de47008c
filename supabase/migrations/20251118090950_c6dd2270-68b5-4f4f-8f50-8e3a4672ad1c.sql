-- Add courier_no column to orders table
ALTER TABLE public.orders
ADD COLUMN courier_no text;

-- Create index for faster lookups
CREATE INDEX idx_orders_courier_no ON public.orders(courier_no);