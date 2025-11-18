-- Drop existing policies for billing_addresses
DROP POLICY IF EXISTS "Users can view their own billing addresses" ON public.billing_addresses;
DROP POLICY IF EXISTS "Users can insert their own billing addresses" ON public.billing_addresses;
DROP POLICY IF EXISTS "Users can update their own billing addresses" ON public.billing_addresses;
DROP POLICY IF EXISTS "Users can delete their own billing addresses" ON public.billing_addresses;

-- Create new policies that work with custom auth and anon role
CREATE POLICY "Users can view their own billing addresses"
ON public.billing_addresses
FOR SELECT
TO anon, authenticated
USING (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE POLICY "Users can insert their own billing addresses"
ON public.billing_addresses
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE POLICY "Users can update their own billing addresses"
ON public.billing_addresses
FOR UPDATE
TO anon, authenticated
USING (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE POLICY "Users can delete their own billing addresses"
ON public.billing_addresses
FOR DELETE
TO anon, authenticated
USING (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

-- Drop and recreate orders policies for anon role
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

-- Drop and recreate order_items policies for anon role
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "Users can create order items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1
  FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
));

CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1
  FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
));

-- Update profiles policies for anon role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO anon, authenticated
USING (id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (id = COALESCE((current_setting('app.user_id'::text, true))::uuid, '00000000-0000-0000-0000-000000000000'::uuid));