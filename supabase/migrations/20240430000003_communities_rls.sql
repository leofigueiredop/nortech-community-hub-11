-- Disable RLS on communities table
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create communities" ON public.communities;
DROP POLICY IF EXISTS "Anyone can view non-private communities" ON public.communities;
DROP POLICY IF EXISTS "Creators can update their communities" ON public.communities;
DROP POLICY IF EXISTS "Creators can delete their communities" ON public.communities;

-- Fix creator_id column type and constraints
-- We remove the default value and keep it as NOT NULL
-- This ensures the creator_id must be explicitly provided during community creation
ALTER TABLE public.communities 
  ALTER COLUMN creator_id TYPE uuid USING creator_id::uuid,
  ALTER COLUMN creator_id SET NOT NULL,
  ALTER COLUMN creator_id DROP DEFAULT;

-- Add comment explaining the change
COMMENT ON COLUMN public.communities.creator_id IS 'UUID of the user who created the community. Must be provided explicitly during creation.'; 