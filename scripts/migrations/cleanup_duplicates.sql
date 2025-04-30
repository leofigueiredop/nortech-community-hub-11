-- Cleanup script for removing duplicate data
BEGIN;

-- 1. Clean up analytics_events (simpler table, no dependencies)
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY community_id, event_type, user_id, metadata::text
           ORDER BY created_at
         ) as row_num
  FROM public.analytics_events
)
DELETE FROM public.analytics_events
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 2. Clean up content_items
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY community_id, title, format, access_level
           ORDER BY created_at
         ) as row_num
  FROM public.content_items
)
DELETE FROM public.content_items
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 3. Clean up discussions and cascade to replies
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY community_id, title, author_id
           ORDER BY created_at
         ) as row_num
  FROM public.discussions
)
DELETE FROM public.discussions
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 4. Clean up discussion_replies
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY discussion_id, author_id, content
           ORDER BY created_at
         ) as row_num
  FROM public.discussion_replies
)
DELETE FROM public.discussion_replies
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 5. Clean up events and cascade to attendees
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY community_id, title, date::date, event_type
           ORDER BY created_at
         ) as row_num
  FROM public.events
)
DELETE FROM public.events
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 6. Clean up posts and cascade to comments and reactions
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY community_id, author_id, content
           ORDER BY created_at
         ) as row_num
  FROM public.posts
)
DELETE FROM public.posts
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 7. Clean up post_comments
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY post_id, author_id, content
           ORDER BY created_at
         ) as row_num
  FROM public.post_comments
)
DELETE FROM public.post_comments
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 8. Clean up post_reactions
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY post_id, user_id, reaction_type
           ORDER BY created_at
         ) as row_num
  FROM public.post_reactions
)
DELETE FROM public.post_reactions
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

COMMIT; 