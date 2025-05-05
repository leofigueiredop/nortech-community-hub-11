-- Add set_tenant_context function
CREATE OR REPLACE FUNCTION set_tenant_context(community_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if the user has access to the community
  IF EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = $1
    AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM communities
    WHERE id = $1
    AND owner_id = auth.uid()
  ) THEN
    -- Set the current tenant context
    PERFORM set_config('app.current_tenant', $1::text, false);
  ELSE
    RAISE EXCEPTION 'Access denied to community %', $1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 