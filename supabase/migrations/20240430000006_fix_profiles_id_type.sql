-- Fix profiles.id type from text to uuid to match auth.uid()
-- This is needed because Supabase auth.uid() returns uuid, not text
-- and we need to join with other tables that use uuid for user references

-- First, ensure we have a user_id column in profiles that is uuid
-- (in case this was missed in previous migrations)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN user_id uuid;
    END IF;
END
$$;

-- Update profiles.id from text to uuid using the auth.uid() format
-- Since id should match auth.uid() which is always uuid
ALTER TABLE public.profiles ALTER COLUMN id TYPE uuid USING id::uuid;

-- Update comment to reflect the change
COMMENT ON COLUMN public.profiles.id IS 'UUID of the user from auth.uid()';

-- If user_id exists, make sure it matches id (they should be the same)
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL OR user_id != id;

-- Make user_id NOT NULL if it wasn't already
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'profiles_user_id_fkey') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END
$$; 