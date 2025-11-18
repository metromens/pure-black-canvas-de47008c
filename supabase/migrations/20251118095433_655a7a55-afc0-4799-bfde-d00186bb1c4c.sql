-- Create a secure function for admins to update courier numbers
CREATE OR REPLACE FUNCTION public.update_courier_numbers(
  _admin_user_id uuid,
  _order_updates jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _order_update jsonb;
BEGIN
  -- Check if the requesting user is an admin
  IF NOT has_role(_admin_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Update each order with its courier number
  FOR _order_update IN SELECT * FROM jsonb_array_elements(_order_updates)
  LOOP
    UPDATE orders
    SET courier_no = _order_update->>'courier_no'
    WHERE id = (_order_update->>'order_id')::uuid;
  END LOOP;
END;
$$;