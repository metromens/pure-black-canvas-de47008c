-- Drop the existing trigger and function since we're not using Supabase auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Modify profiles table for custom authentication
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add email and password_hash columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text UNIQUE NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash text NOT NULL;

-- Update RLS policies for custom auth
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- New RLS policies
CREATE POLICY "Anyone can create profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = (current_setting('app.user_id', true))::uuid);