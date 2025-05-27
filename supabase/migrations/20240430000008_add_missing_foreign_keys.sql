-- Add missing foreign key constraints for tables that reference profiles
-- This ensures PostgREST can automatically join these tables

-- Clean up orphaned records first
DELETE FROM public.post_comments 
WHERE author_id NOT IN (SELECT id FROM public.profiles);

DELETE FROM public.discussion_replies 
WHERE author_id NOT IN (SELECT id FROM public.profiles);

DELETE FROM public.discussions 
WHERE author_id NOT IN (SELECT id FROM public.profiles);

-- Add foreign key constraints
ALTER TABLE public.post_comments 
ADD CONSTRAINT post_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.discussion_replies 
ADD CONSTRAINT discussion_replies_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.discussions 
ADD CONSTRAINT discussions_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add missing is_featured column to posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'is_featured') THEN
        ALTER TABLE public.posts ADD COLUMN is_featured boolean DEFAULT false;
    END IF;
END
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS post_comments_author_id_idx ON public.post_comments(author_id);
CREATE INDEX IF NOT EXISTS discussion_replies_author_id_idx ON public.discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS discussions_author_id_idx ON public.discussions(author_id);
CREATE INDEX IF NOT EXISTS posts_is_featured_idx ON public.posts(is_featured);

-- Update comments
COMMENT ON COLUMN public.post_comments.author_id IS 'UUID of the comment author - references profiles.id';
COMMENT ON COLUMN public.discussion_replies.author_id IS 'UUID of the reply author - references profiles.id';
COMMENT ON COLUMN public.discussions.author_id IS 'UUID of the discussion author - references profiles.id'; 