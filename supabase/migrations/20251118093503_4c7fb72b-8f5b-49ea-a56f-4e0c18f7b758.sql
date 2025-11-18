-- Create function to list all profiles for admins
CREATE OR REPLACE FUNCTION public.list_all_profiles(_admin_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  city text,
  state text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user is an admin
  IF NOT has_role(_admin_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Return all profiles
  RETURN QUERY
  SELECT p.id, p.name, p.email, p.phone, p.city, p.state, p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Create function to list all orders for admins
CREATE OR REPLACE FUNCTION public.list_all_orders(_admin_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  billing_name text,
  billing_address text,
  billing_phone text,
  total_amount numeric,
  status text,
  courier_no text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user is an admin
  IF NOT has_role(_admin_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Return all orders
  RETURN QUERY
  SELECT o.id, o.user_id, o.billing_name, o.billing_address, o.billing_phone, 
         o.total_amount, o.status, o.courier_no, o.created_at, o.updated_at
  FROM orders o
  ORDER BY o.created_at DESC;
END;
$$;