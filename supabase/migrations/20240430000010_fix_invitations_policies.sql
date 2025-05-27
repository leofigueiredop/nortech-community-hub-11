-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Community members can view invitations" ON public.invitations;
DROP POLICY IF EXISTS "Community admins can create invitations" ON public.invitations;
DROP POLICY IF EXISTS "Community admins can update invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.invitations;

-- Create more permissive policies for testing and debugging

-- Policy: Allow authenticated users to view invitations for communities they have access to
CREATE POLICY "Allow viewing invitations for accessible communities" ON public.invitations
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            -- User is a member of the community
            community_id IN (
                SELECT community_id FROM public.community_members 
                WHERE user_id = auth.uid() AND status = 'active'
            )
            OR
            -- User is the creator of the community
            community_id IN (
                SELECT id FROM public.communities 
                WHERE creator_id = auth.uid()
            )
            OR
            -- User can view their own invitations (by email)
            email IN (
                SELECT email FROM auth.users WHERE id = auth.uid()
            )
        )
    );

-- Policy: Allow community admins/owners to create invitations
CREATE POLICY "Allow creating invitations for managed communities" ON public.invitations
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND (
            -- User is an admin/owner member of the community
            community_id IN (
                SELECT community_id FROM public.community_members 
                WHERE user_id = auth.uid() 
                AND status = 'active' 
                AND role IN ('admin', 'owner')
            )
            OR
            -- User is the creator of the community
            community_id IN (
                SELECT id FROM public.communities 
                WHERE creator_id = auth.uid()
            )
        )
    );

-- Policy: Allow community admins/owners to update invitations
CREATE POLICY "Allow updating invitations for managed communities" ON public.invitations
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            -- User is an admin/owner member of the community
            community_id IN (
                SELECT community_id FROM public.community_members 
                WHERE user_id = auth.uid() 
                AND status = 'active' 
                AND role IN ('admin', 'owner')
            )
            OR
            -- User is the creator of the community
            community_id IN (
                SELECT id FROM public.communities 
                WHERE creator_id = auth.uid()
            )
        )
    );

-- Policy: Allow deleting invitations for managed communities
CREATE POLICY "Allow deleting invitations for managed communities" ON public.invitations
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND (
            -- User is an admin/owner member of the community
            community_id IN (
                SELECT community_id FROM public.community_members 
                WHERE user_id = auth.uid() 
                AND status = 'active' 
                AND role IN ('admin', 'owner')
            )
            OR
            -- User is the creator of the community
            community_id IN (
                SELECT id FROM public.communities 
                WHERE creator_id = auth.uid()
            )
        )
    );

-- Temporary policy for debugging - allow all operations for authenticated users
-- Remove this in production!
-- CREATE POLICY "temp_allow_all_invitations" ON public.invitations
--     FOR ALL USING (auth.uid() IS NOT NULL);

-- Ensure the table has RLS enabled
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY; 