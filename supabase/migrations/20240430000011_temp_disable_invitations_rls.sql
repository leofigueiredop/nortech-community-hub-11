-- Temporary migration to disable RLS on invitations table for debugging
-- This should be reverted after fixing the issue

-- Disable RLS temporarily
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;

-- Add a comment to remember this is temporary
COMMENT ON TABLE public.invitations IS 'RLS temporarily disabled for debugging - remember to re-enable!'; 