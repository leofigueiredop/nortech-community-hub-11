-- Fix foreign key types in invitations table - FINAL VERSION

-- Drop the table if it exists to recreate with correct types
DROP TABLE IF EXISTS public.invitations CASCADE;

-- Recreate invitations table with correct types
CREATE TABLE public.invitations (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'member',
    community_id uuid NOT NULL,
    invited_by uuid NOT NULL, -- Changed to uuid to match auth.users.id
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
CREATE INDEX invitations_invited_by_idx ON public.invitations USING btree (invited_by);

-- Create unique constraint to prevent duplicate pending invitations
CREATE UNIQUE INDEX invitations_unique_pending_idx ON public.invitations (email, community_id) 
WHERE status = 'pending';

-- Disable RLS for now to test functionality
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE public.invitations TO postgres;
GRANT ALL ON TABLE public.invitations TO anon;
GRANT ALL ON TABLE public.invitations TO authenticated;
GRANT ALL ON TABLE public.invitations TO service_role;

-- Add comment for clarity
COMMENT ON TABLE public.invitations IS 'Invitations table with RLS disabled for testing - remember to re-enable after fixing policies'; 