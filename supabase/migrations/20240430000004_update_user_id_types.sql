-- Update user_id columns from text to uuid in all tables
ALTER TABLE public.posts ALTER COLUMN author_id TYPE uuid USING author_id::uuid;
ALTER TABLE public.messages ALTER COLUMN sender_id TYPE uuid USING sender_id::uuid;
ALTER TABLE public.community_members ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.notification_settings ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.notifications ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.points_activities ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.user_activity ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.user_badges ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.user_points ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.conversation_members ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.discussions ALTER COLUMN author_id TYPE uuid USING author_id::uuid;
ALTER TABLE public.events ALTER COLUMN organizer_id TYPE uuid USING organizer_id::uuid;
ALTER TABLE public.post_comments ALTER COLUMN author_id TYPE uuid USING author_id::uuid;
ALTER TABLE public.post_reactions ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.redemptions ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.discussion_replies ALTER COLUMN author_id TYPE uuid USING author_id::uuid;
ALTER TABLE public.event_attendees ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Update comments to reflect the change
COMMENT ON COLUMN public.posts.author_id IS 'UUID of the user who created the post';
COMMENT ON COLUMN public.messages.sender_id IS 'UUID of the message sender';
COMMENT ON COLUMN public.community_members.user_id IS 'UUID of the community member';
COMMENT ON COLUMN public.notification_settings.user_id IS 'UUID of the user';
COMMENT ON COLUMN public.notifications.user_id IS 'UUID of the user receiving the notification';
COMMENT ON COLUMN public.points_activities.user_id IS 'UUID of the user earning points';
COMMENT ON COLUMN public.user_activity.user_id IS 'UUID of the user performing the activity';
COMMENT ON COLUMN public.user_badges.user_id IS 'UUID of the user receiving the badge';
COMMENT ON COLUMN public.user_points.user_id IS 'UUID of the user';
COMMENT ON COLUMN public.conversation_members.user_id IS 'UUID of the conversation participant';
COMMENT ON COLUMN public.discussions.author_id IS 'UUID of the discussion author';
COMMENT ON COLUMN public.events.organizer_id IS 'UUID of the event organizer';
COMMENT ON COLUMN public.post_comments.author_id IS 'UUID of the comment author';
COMMENT ON COLUMN public.post_reactions.user_id IS 'UUID of the user reacting';
COMMENT ON COLUMN public.redemptions.user_id IS 'UUID of the user redeeming the reward';
COMMENT ON COLUMN public.discussion_replies.author_id IS 'UUID of the reply author';
COMMENT ON COLUMN public.event_attendees.user_id IS 'UUID of the event attendee'; 