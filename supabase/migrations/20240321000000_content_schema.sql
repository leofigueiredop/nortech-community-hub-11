-- Enhance content_items table
ALTER TABLE content_items
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS content_items_status_idx ON content_items(status);
CREATE INDEX IF NOT EXISTS content_items_access_level_idx ON content_items(access_level);
CREATE INDEX IF NOT EXISTS content_items_published_at_idx ON content_items(published_at);
CREATE INDEX IF NOT EXISTS content_items_slug_idx ON content_items(slug);
CREATE UNIQUE INDEX IF NOT EXISTS content_items_community_slug_idx ON content_items(community_id, slug) WHERE status = 'published';

-- Add content versioning table
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  UNIQUE(content_id, version)
);

CREATE INDEX IF NOT EXISTS content_versions_content_id_idx ON content_versions(content_id);

-- Add content access logs for analytics
CREATE TABLE IF NOT EXISTS content_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  user_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS content_access_logs_content_id_idx ON content_access_logs(content_id);
CREATE INDEX IF NOT EXISTS content_access_logs_user_id_idx ON content_access_logs(user_id);
CREATE INDEX IF NOT EXISTS content_access_logs_community_id_idx ON content_access_logs(community_id);

-- Add RLS policies
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content items are viewable by community members"
ON content_items FOR SELECT
USING (
  community_id IN (
    SELECT cm.community_id 
    FROM community_members cm 
    WHERE cm.user_id = auth.uid()
  )
  AND (
    status = 'published' 
    OR auth.uid() IN (
      SELECT cm.user_id 
      FROM community_members cm 
      WHERE cm.community_id = content_items.community_id 
      AND cm.role IN ('admin', 'owner', 'moderator')
    )
  )
);

CREATE POLICY "Content items are editable by admins and owners"
ON content_items FOR ALL
USING (
  auth.uid() IN (
    SELECT cm.user_id 
    FROM community_members cm 
    WHERE cm.community_id = content_items.community_id 
    AND cm.role IN ('admin', 'owner')
  )
); 