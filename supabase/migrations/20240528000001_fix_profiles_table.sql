-- Drop existing profiles table if it exists
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with correct structure
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    email text UNIQUE,
    bio text,
    website text,
    display_name text,
    role text,
    access_level text CHECK (access_level IN ('free', 'premium', 'premium_plus')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX profiles_email_idx ON public.profiles(email);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Grant permissions
ALTER TABLE public.profiles OWNER TO postgres;
GRANT ALL ON TABLE public.profiles TO postgres;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- Create trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at(); 