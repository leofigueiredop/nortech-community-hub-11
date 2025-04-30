-- Clean all tables in correct dependency order
BEGIN;

-- Level 6 (most dependent)
TRUNCATE TABLE public.discussion_replies CASCADE;
TRUNCATE TABLE public.message_attachments CASCADE;
TRUNCATE TABLE public.post_reactions CASCADE;
TRUNCATE TABLE public.post_comments CASCADE;
TRUNCATE TABLE public.event_attendees CASCADE;
TRUNCATE TABLE public.redemptions CASCADE;

-- Level 5
TRUNCATE TABLE public.discussions CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.posts CASCADE;
TRUNCATE TABLE public.events CASCADE;

-- Level 4
TRUNCATE TABLE public.discussion_topics CASCADE;
TRUNCATE TABLE public.conversation_members CASCADE;
TRUNCATE TABLE public.content_items CASCADE;

-- Level 3
TRUNCATE TABLE public.conversations CASCADE;
TRUNCATE TABLE public.spaces CASCADE;
TRUNCATE TABLE public.user_badges CASCADE;
TRUNCATE TABLE public.points_activities CASCADE;
TRUNCATE TABLE public.user_points CASCADE;
TRUNCATE TABLE public.user_activity CASCADE;
TRUNCATE TABLE public.analytics_events CASCADE;

-- Level 2
TRUNCATE TABLE public.badges CASCADE;
TRUNCATE TABLE public.rewards CASCADE;
TRUNCATE TABLE public.level_configs CASCADE;
TRUNCATE TABLE public.subscription_plans CASCADE;
TRUNCATE TABLE public.payment_gateways CASCADE;
TRUNCATE TABLE public.permissions CASCADE;
TRUNCATE TABLE public.notification_settings CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.content_categories CASCADE;

-- Level 1
TRUNCATE TABLE public.community_settings CASCADE;
TRUNCATE TABLE public.community_members CASCADE;

-- Level 0 (base table)
TRUNCATE TABLE public.communities CASCADE;

COMMIT; 