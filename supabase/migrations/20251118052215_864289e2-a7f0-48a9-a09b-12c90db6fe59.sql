-- Create a function to set the user context for RLS policies
CREATE OR REPLACE FUNCTION public.set_current_user_id(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.user_id', user_id::text, false);
END;
$$;