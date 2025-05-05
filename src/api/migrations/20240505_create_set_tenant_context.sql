-- Function to set tenant context for RLS policies
create or replace function public.set_tenant_context(tenant_id uuid)
returns void as $$
begin
  -- Store the tenant_id in the current session
  perform set_config('app.current_tenant_id', tenant_id::text, false);
end;
$$ language plpgsql security definer; 