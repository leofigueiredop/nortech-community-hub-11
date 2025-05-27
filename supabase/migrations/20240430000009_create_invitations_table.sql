-- Create invitations table
CREATE TABLE public.invitations (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'member',
    community_id uuid NOT NULL,
    invited_by uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now() NOT NULL,
    expires_at timestamptz NOT NULL,
    accepted_at timestamptz NULL,
    CONSTRAINT invitations_pkey PRIMARY KEY (id),
    CONSTRAINT invitations_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
    CONSTRAINT invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT invitations_status_check CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    CONSTRAINT invitations_role_check CHECK (role IN ('member', 'moderator', 'admin'))
);

-- Create indexes for better performance
CREATE INDEX invitations_community_id_idx ON public.invitations USING btree (community_id);
CREATE INDEX invitations_email_idx ON public.invitations USING btree (email);
CREATE INDEX invitations_status_idx ON public.invitations USING btree (status);
CREATE INDEX invitations_expires_at_idx ON public.invitations USING btree (expires_at);

-- Create unique constraint to prevent duplicate pending invitations
CREATE UNIQUE INDEX invitations_unique_pending_idx ON public.invitations (email, community_id) 
WHERE status = 'pending';

-- Add RLS policies
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Community members can view invitations for their community
CREATE POLICY "Community members can view invitations" ON public.invitations
    FOR SELECT USING (
        community_id IN (
            SELECT community_id FROM public.community_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
        OR community_id IN (
            SELECT id FROM public.communities 
            WHERE creator_id = auth.uid()
        )
    );

-- Policy: Community admins/owners can create invitations
CREATE POLICY "Community admins can create invitations" ON public.invitations
    FOR INSERT WITH CHECK (
        community_id IN (
            SELECT community_id FROM public.community_members 
            WHERE user_id = auth.uid() 
            AND status = 'active' 
            AND role IN ('admin', 'owner')
        )
        OR community_id IN (
            SELECT id FROM public.communities 
            WHERE creator_id = auth.uid()
        )
    );

-- Policy: Community admins/owners can update invitations
CREATE POLICY "Community admins can update invitations" ON public.invitations
    FOR UPDATE USING (
        community_id IN (
            SELECT community_id FROM public.community_members 
            WHERE user_id = auth.uid() 
            AND status = 'active' 
            AND role IN ('admin', 'owner')
        )
        OR community_id IN (
            SELECT id FROM public.communities 
            WHERE creator_id = auth.uid()
        )
    );

-- Policy: Allow invited users to view their own invitations (for validation)
CREATE POLICY "Users can view their own invitations" ON public.invitations
    FOR SELECT USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR email = auth.email()
    );

-- Function to automatically expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the expiration function (if pg_cron is available)
-- This would typically be set up separately in production
-- SELECT cron.schedule('expire-invitations', '0 0 * * *', 'SELECT expire_old_invitations();');

-- Grant permissions
GRANT ALL ON TABLE public.invitations TO postgres;
GRANT ALL ON TABLE public.invitations TO anon;
GRANT ALL ON TABLE public.invitations TO authenticated;
GRANT ALL ON TABLE public.invitations TO service_role; 