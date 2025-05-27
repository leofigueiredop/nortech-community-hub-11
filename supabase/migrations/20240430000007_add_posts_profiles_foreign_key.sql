-- Add foreign key constraint between posts.author_id and profiles.id
-- This is needed for Supabase PostgREST to automatically join tables
-- in queries like .select('*, author:profiles(*)')

-- First, make sure all existing posts have valid author_ids that exist in profiles
-- Remove any orphaned posts (posts with author_id that doesn't exist in profiles)
DELETE FROM public.posts 
WHERE author_id NOT IN (SELECT id FROM public.profiles);

-- Add the foreign key constraint
ALTER TABLE public.posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add index for better join performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);

-- Update the comment to clarify the relationship
COMMENT ON COLUMN public.posts.author_id IS 'UUID of the user who created the post - references profiles.id'; 