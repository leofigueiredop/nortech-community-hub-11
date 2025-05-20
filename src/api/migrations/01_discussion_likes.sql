-- Create discussion_likes table for tracking upvotes on discussions
CREATE TABLE IF NOT EXISTS public.discussion_likes (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  discussion_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now() NULL,
  CONSTRAINT discussion_likes_pkey PRIMARY KEY (id),
  CONSTRAINT discussion_likes_discussion_id_user_id_key UNIQUE (discussion_id, user_id),
  CONSTRAINT discussion_likes_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS discussion_likes_discussion_idx ON public.discussion_likes USING btree (discussion_id);
CREATE INDEX IF NOT EXISTS discussion_likes_user_idx ON public.discussion_likes USING btree (user_id);

-- Enable Row Level Security
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view likes" 
ON public.discussion_likes FOR SELECT 
USING (true);

CREATE POLICY "Users can create likes for discussions in their communities" 
ON public.discussion_likes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.discussions d
    JOIN public.community_members cm ON d.community_id = cm.community_id
    WHERE d.id = discussion_id AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own likes" 
ON public.discussion_likes FOR DELETE 
USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON TABLE public.discussion_likes TO postgres;
GRANT ALL ON TABLE public.discussion_likes TO anon;
GRANT ALL ON TABLE public.discussion_likes TO authenticated;
GRANT ALL ON TABLE public.discussion_likes TO service_role; 