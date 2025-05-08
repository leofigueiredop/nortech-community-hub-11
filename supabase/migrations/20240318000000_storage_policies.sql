-- Enable RLS
alter table storage.objects enable row level security;

-- Policy to allow authenticated users to upload files to community-assets bucket
create policy "Allow authenticated uploads to community-assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'community-assets' and
  (auth.role() = 'authenticated')
);

-- Policy to allow authenticated users to update their own files
create policy "Allow authenticated updates to own files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'community-assets' and
  (auth.uid() = owner_id::uuid)
);

-- Policy to allow authenticated users to select/download files
create policy "Allow authenticated downloads from community-assets"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'community-assets'
);

-- Policy to allow public access to certain folders (like logos)
create policy "Allow public access to logos"
on storage.objects
for select
to anon
using (
  bucket_id = 'community-assets' and
  (storage.foldername(name))[1] in ('logo', 'favicon')
); 