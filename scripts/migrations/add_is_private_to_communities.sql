-- Add is_private column to communities table
ALTER TABLE public.communities 
ADD COLUMN is_private boolean DEFAULT false;

-- Grant permissions
GRANT ALL ON TABLE public.communities TO postgres;
GRANT ALL ON TABLE public.communities TO anon;
GRANT ALL ON TABLE public.communities TO authenticated;
GRANT ALL ON TABLE public.communities TO service_role;

-- Add comment
COMMENT ON COLUMN public.communities.is_private IS 'Indicates if the community is private (true) or public (false)'; 