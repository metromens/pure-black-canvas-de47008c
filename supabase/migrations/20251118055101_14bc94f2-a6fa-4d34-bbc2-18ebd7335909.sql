-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create billing_addresses table
CREATE TABLE public.billing_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own billing addresses"
ON public.billing_addresses
FOR SELECT
USING (user_id = (current_setting('app.user_id'::text, true))::uuid);

CREATE POLICY "Users can insert their own billing addresses"
ON public.billing_addresses
FOR INSERT
WITH CHECK (user_id = (current_setting('app.user_id'::text, true))::uuid);

CREATE POLICY "Users can update their own billing addresses"
ON public.billing_addresses
FOR UPDATE
USING (user_id = (current_setting('app.user_id'::text, true))::uuid);

CREATE POLICY "Users can delete their own billing addresses"
ON public.billing_addresses
FOR DELETE
USING (user_id = (current_setting('app.user_id'::text, true))::uuid);

-- Create trigger for updated_at
CREATE TRIGGER update_billing_addresses_updated_at
BEFORE UPDATE ON public.billing_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();