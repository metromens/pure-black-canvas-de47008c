-- Add policy for admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO public
USING (has_role(COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid), 'admin'::app_role));

-- Add policy for admins to view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
TO public
USING (has_role(COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid), 'admin'::app_role));