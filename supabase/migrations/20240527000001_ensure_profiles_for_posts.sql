-- Ensure profiles exist for all post authors
-- This migration creates missing profiles for any author_id referenced in posts

-- Create missing profiles for post authors
INSERT INTO public.profiles (id, full_name, avatar_url, updated_at)
SELECT DISTINCT 
    posts.author_id,
    'User ' || substring(posts.author_id::text, 1, 8) as full_name,
    null as avatar_url,
    now() as updated_at
FROM public.posts 
LEFT JOIN public.profiles ON posts.author_id = profiles.id
WHERE profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update any existing profiles with null full_name
UPDATE public.profiles 
SET full_name = 'User ' || substring(id::text, 1, 8)
WHERE full_name IS NULL OR full_name = '';

-- Verify the fix
DO $$
BEGIN
    RAISE NOTICE 'Profiles created/updated. Total profiles: %', (SELECT COUNT(*) FROM public.profiles);
    RAISE NOTICE 'Posts without profiles: %', (
        SELECT COUNT(*) 
        FROM public.posts 
        LEFT JOIN public.profiles ON posts.author_id = profiles.id
        WHERE profiles.id IS NULL
    );
END
$$; 