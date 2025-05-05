-- Enable storage
insert into storage.buckets (id, name, public)
values ('community-assets', 'community-assets', true);

-- Set up public access policies
create policy "Public Access"
on storage.objects for all
using ( bucket_id = 'community-assets' );

-- Grant access to authenticated and anon users
grant all on storage.objects to anon;
grant all on storage.objects to authenticated; 