-- public.communities definição

-- Drop table

-- DROP TABLE public.communities;

CREATE TABLE public.communities (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	logo_url text NULL,
	banner_url text NULL,
	"domain" text NULL,
	creator_id text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	status text DEFAULT 'active'::text NULL,
	theme_config jsonb NULL,
	api_keys jsonb NULL,
	is_private bool DEFAULT false NULL,
	CONSTRAINT communities_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.communities OWNER TO postgres;
GRANT ALL ON TABLE public.communities TO postgres;
GRANT ALL ON TABLE public.communities TO anon;
GRANT ALL ON TABLE public.communities TO authenticated;
GRANT ALL ON TABLE public.communities TO service_role;


-- public.analytics_events definição

-- Drop table

-- DROP TABLE public.analytics_events;

CREATE TABLE public.analytics_events (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	event_type text NOT NULL,
	user_id text NULL,
	metadata jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
	CONSTRAINT analytics_events_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX analytics_events_community_idx ON public.analytics_events USING btree (community_id);

-- Permissions

ALTER TABLE public.analytics_events OWNER TO postgres;
GRANT ALL ON TABLE public.analytics_events TO postgres;
GRANT ALL ON TABLE public.analytics_events TO anon;
GRANT ALL ON TABLE public.analytics_events TO authenticated;
GRANT ALL ON TABLE public.analytics_events TO service_role;


-- public.badges definição

-- Drop table

-- DROP TABLE public.badges;

CREATE TABLE public.badges (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	icon_url text NULL,
	points_value int4 DEFAULT 0 NULL,
	category text NULL,
	requirements jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT badges_pkey PRIMARY KEY (id),
	CONSTRAINT badges_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX badges_community_id_idx ON public.badges USING btree (community_id);

-- Permissions

ALTER TABLE public.badges OWNER TO postgres;
GRANT ALL ON TABLE public.badges TO postgres;
GRANT ALL ON TABLE public.badges TO anon;
GRANT ALL ON TABLE public.badges TO authenticated;
GRANT ALL ON TABLE public.badges TO service_role;


-- public.community_members definição

-- Drop table

-- DROP TABLE public.community_members;

CREATE TABLE public.community_members (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	user_id text NOT NULL,
	"role" text DEFAULT 'member'::text NULL,
	status text DEFAULT 'active'::text NULL,
	subscription_plan_id uuid NULL,
	joined_at timestamptz DEFAULT now() NULL,
	subscription_start_date timestamptz NULL,
	subscription_end_date timestamptz NULL,
	custom_fields jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT community_members_community_id_user_id_key UNIQUE (community_id, user_id),
	CONSTRAINT community_members_pkey PRIMARY KEY (id),
	CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX community_members_community_id_idx ON public.community_members USING btree (community_id);
CREATE INDEX community_members_user_id_idx ON public.community_members USING btree (user_id);

-- Permissions

ALTER TABLE public.community_members OWNER TO postgres;
GRANT ALL ON TABLE public.community_members TO postgres;
GRANT ALL ON TABLE public.community_members TO anon;
GRANT ALL ON TABLE public.community_members TO authenticated;
GRANT ALL ON TABLE public.community_members TO service_role;


-- public.community_settings definição

-- Drop table

-- DROP TABLE public.community_settings;

CREATE TABLE public.community_settings (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	settings_type text NOT NULL,
	settings_data jsonb NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT community_settings_community_id_settings_type_key UNIQUE (community_id, settings_type),
	CONSTRAINT community_settings_pkey PRIMARY KEY (id),
	CONSTRAINT community_settings_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);

-- Permissions

ALTER TABLE public.community_settings OWNER TO postgres;
GRANT ALL ON TABLE public.community_settings TO postgres;
GRANT ALL ON TABLE public.community_settings TO anon;
GRANT ALL ON TABLE public.community_settings TO authenticated;
GRANT ALL ON TABLE public.community_settings TO service_role;


-- public.content_categories definição

-- Drop table

-- DROP TABLE public.content_categories;

CREATE TABLE public.content_categories (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	parent_id uuid NULL,
	created_at timestamptz DEFAULT now() NULL,
	community_id uuid NULL,
	CONSTRAINT content_categories_pkey PRIMARY KEY (id),
	CONSTRAINT content_categories_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT content_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.content_categories(id)
);
CREATE INDEX content_categories_community_id_idx ON public.content_categories USING btree (community_id);

-- Permissions

ALTER TABLE public.content_categories OWNER TO postgres;
GRANT ALL ON TABLE public.content_categories TO postgres;
GRANT ALL ON TABLE public.content_categories TO anon;
GRANT ALL ON TABLE public.content_categories TO authenticated;
GRANT ALL ON TABLE public.content_categories TO service_role;


-- public.conversations definição

-- Drop table

-- DROP TABLE public.conversations;

CREATE TABLE public.conversations (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"type" text DEFAULT 'private'::text NULL,
	title text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT conversations_pkey PRIMARY KEY (id),
	CONSTRAINT conversations_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);

-- Permissions

ALTER TABLE public.conversations OWNER TO postgres;
GRANT ALL ON TABLE public.conversations TO postgres;
GRANT ALL ON TABLE public.conversations TO anon;
GRANT ALL ON TABLE public.conversations TO authenticated;
GRANT ALL ON TABLE public.conversations TO service_role;


-- public.level_configs definição

-- Drop table

-- DROP TABLE public.level_configs;

CREATE TABLE public.level_configs (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"level" int4 NOT NULL,
	points_required int4 NOT NULL,
	"name" text NULL,
	benefits jsonb NULL,
	badge_id uuid NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT level_configs_community_id_level_key UNIQUE (community_id, level),
	CONSTRAINT level_configs_pkey PRIMARY KEY (id),
	CONSTRAINT level_configs_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id),
	CONSTRAINT level_configs_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX level_configs_community_idx ON public.level_configs USING btree (community_id);

-- Permissions

ALTER TABLE public.level_configs OWNER TO postgres;
GRANT ALL ON TABLE public.level_configs TO postgres;
GRANT ALL ON TABLE public.level_configs TO anon;
GRANT ALL ON TABLE public.level_configs TO authenticated;
GRANT ALL ON TABLE public.level_configs TO service_role;


-- public.messages definição

-- Drop table

-- DROP TABLE public.messages;

CREATE TABLE public.messages (
	id uuid NOT NULL,
	conversation_id uuid NULL,
	sender_id text NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'text'::text NULL,
	metadata jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT messages_pkey PRIMARY KEY (id),
	CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id)
);
CREATE INDEX messages_conversation_idx ON public.messages USING btree (conversation_id);

-- Permissions

ALTER TABLE public.messages OWNER TO postgres;
GRANT ALL ON TABLE public.messages TO postgres;
GRANT ALL ON TABLE public.messages TO anon;
GRANT ALL ON TABLE public.messages TO authenticated;
GRANT ALL ON TABLE public.messages TO service_role;


-- public.notification_settings definição

-- Drop table

-- DROP TABLE public.notification_settings;

CREATE TABLE public.notification_settings (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	user_id text NOT NULL,
	settings_data jsonb NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT notification_settings_community_id_user_id_key UNIQUE (community_id, user_id),
	CONSTRAINT notification_settings_pkey PRIMARY KEY (id),
	CONSTRAINT notification_settings_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);

-- Permissions

ALTER TABLE public.notification_settings OWNER TO postgres;
GRANT ALL ON TABLE public.notification_settings TO postgres;
GRANT ALL ON TABLE public.notification_settings TO anon;
GRANT ALL ON TABLE public.notification_settings TO authenticated;
GRANT ALL ON TABLE public.notification_settings TO service_role;


-- public.notifications definição

-- Drop table

-- DROP TABLE public.notifications;

CREATE TABLE public.notifications (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	user_id text NOT NULL,
	"type" text NOT NULL,
	title text NOT NULL,
	"content" text NULL,
	link text NULL,
	"read" bool DEFAULT false NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT notifications_pkey PRIMARY KEY (id),
	CONSTRAINT notifications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX notifications_user_community_idx ON public.notifications USING btree (user_id, community_id);

-- Permissions

ALTER TABLE public.notifications OWNER TO postgres;
GRANT ALL ON TABLE public.notifications TO postgres;
GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


-- public.payment_gateways definição

-- Drop table

-- DROP TABLE public.payment_gateways;

CREATE TABLE public.payment_gateways (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	gateway_type text NOT NULL,
	is_active bool DEFAULT false NULL,
	config jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT payment_gateways_community_id_gateway_type_key UNIQUE (community_id, gateway_type),
	CONSTRAINT payment_gateways_pkey PRIMARY KEY (id),
	CONSTRAINT payment_gateways_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);

-- Permissions

ALTER TABLE public.payment_gateways OWNER TO postgres;
GRANT ALL ON TABLE public.payment_gateways TO postgres;
GRANT ALL ON TABLE public.payment_gateways TO anon;
GRANT ALL ON TABLE public.payment_gateways TO authenticated;
GRANT ALL ON TABLE public.payment_gateways TO service_role;


-- public.permissions definição

-- Drop table

-- DROP TABLE public.permissions;

CREATE TABLE public.permissions (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"role" text NOT NULL,
	resource text NOT NULL,
	"action" text NOT NULL,
	conditions jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT permissions_community_id_role_resource_action_key UNIQUE (community_id, role, resource, action),
	CONSTRAINT permissions_pkey PRIMARY KEY (id),
	CONSTRAINT permissions_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);

-- Permissions

ALTER TABLE public.permissions OWNER TO postgres;
GRANT ALL ON TABLE public.permissions TO postgres;
GRANT ALL ON TABLE public.permissions TO anon;
GRANT ALL ON TABLE public.permissions TO authenticated;
GRANT ALL ON TABLE public.permissions TO service_role;


-- public.points_activities definição

-- Drop table

-- DROP TABLE public.points_activities;

CREATE TABLE public.points_activities (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	user_id text NOT NULL,
	activity_type text NOT NULL,
	points int4 NOT NULL,
	description text NULL,
	reference_id text NULL,
	reference_type text NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT points_activities_pkey PRIMARY KEY (id),
	CONSTRAINT points_activities_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX points_activities_created_idx ON public.points_activities USING btree (created_at);
CREATE INDEX points_activities_type_idx ON public.points_activities USING btree (activity_type);
CREATE INDEX points_activities_user_community_idx ON public.points_activities USING btree (user_id, community_id);

-- Permissions

ALTER TABLE public.points_activities OWNER TO postgres;
GRANT ALL ON TABLE public.points_activities TO postgres;
GRANT ALL ON TABLE public.points_activities TO anon;
GRANT ALL ON TABLE public.points_activities TO authenticated;
GRANT ALL ON TABLE public.points_activities TO service_role;


-- public.posts definição

-- Drop table

-- DROP TABLE public.posts;

CREATE TABLE public.posts (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	author_id text NOT NULL,
	"content" text NOT NULL,
	media_urls _text NULL,
	visibility text DEFAULT 'public'::text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT posts_pkey PRIMARY KEY (id),
	CONSTRAINT posts_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX posts_author_id_idx ON public.posts USING btree (author_id);
CREATE INDEX posts_community_id_idx ON public.posts USING btree (community_id);

-- Permissions

ALTER TABLE public.posts OWNER TO postgres;
GRANT ALL ON TABLE public.posts TO postgres;
GRANT ALL ON TABLE public.posts TO anon;
GRANT ALL ON TABLE public.posts TO authenticated;
GRANT ALL ON TABLE public.posts TO service_role;


-- public.rewards definição

-- Drop table

-- DROP TABLE public.rewards;

CREATE TABLE public.rewards (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	image_url text NULL,
	points_cost int4 NOT NULL,
	is_active bool DEFAULT true NULL,
	quantity_available int4 NULL,
	created_at timestamptz DEFAULT now() NULL,
	expires_at timestamptz NULL,
	community_id uuid NULL,
	CONSTRAINT rewards_pkey PRIMARY KEY (id),
	CONSTRAINT rewards_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX rewards_community_id_idx ON public.rewards USING btree (community_id);

-- Permissions

ALTER TABLE public.rewards OWNER TO postgres;
GRANT ALL ON TABLE public.rewards TO postgres;
GRANT ALL ON TABLE public.rewards TO anon;
GRANT ALL ON TABLE public.rewards TO authenticated;
GRANT ALL ON TABLE public.rewards TO service_role;


-- public.spaces definição

-- Drop table

-- DROP TABLE public.spaces;

CREATE TABLE public.spaces (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	"type" text NOT NULL,
	icon text NULL,
	banner_url text NULL,
	config jsonb NULL,
	visibility text DEFAULT 'public'::text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT spaces_pkey PRIMARY KEY (id),
	CONSTRAINT spaces_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX spaces_community_id_idx ON public.spaces USING btree (community_id);

-- Permissions

ALTER TABLE public.spaces OWNER TO postgres;
GRANT ALL ON TABLE public.spaces TO postgres;
GRANT ALL ON TABLE public.spaces TO anon;
GRANT ALL ON TABLE public.spaces TO authenticated;
GRANT ALL ON TABLE public.spaces TO service_role;


-- public.subscription_plans definição

-- Drop table

-- DROP TABLE public.subscription_plans;

CREATE TABLE public.subscription_plans (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	price numeric(10, 2) NULL,
	"interval" text DEFAULT 'month'::text NULL,
	features jsonb NULL,
	is_active bool DEFAULT true NULL,
	trial_days int4 NULL,
	max_members int4 NULL,
	visibility text DEFAULT 'public'::text NULL,
	progressive_content bool DEFAULT false NULL,
	retention_days int4 NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT subscription_plans_pkey PRIMARY KEY (id),
	CONSTRAINT subscription_plans_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX subscription_plans_community_id_idx ON public.subscription_plans USING btree (community_id);

-- Permissions

ALTER TABLE public.subscription_plans OWNER TO postgres;
GRANT ALL ON TABLE public.subscription_plans TO postgres;
GRANT ALL ON TABLE public.subscription_plans TO anon;
GRANT ALL ON TABLE public.subscription_plans TO authenticated;
GRANT ALL ON TABLE public.subscription_plans TO service_role;


-- public.user_activity definição

-- Drop table

-- DROP TABLE public.user_activity;

CREATE TABLE public.user_activity (
	id uuid NOT NULL,
	community_id uuid NOT NULL,
	user_id text NOT NULL,
	activity_type text NOT NULL,
	metadata jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT user_activity_pkey PRIMARY KEY (id),
	CONSTRAINT user_activity_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX user_activity_user_community_idx ON public.user_activity USING btree (user_id, community_id);

-- Permissions

ALTER TABLE public.user_activity OWNER TO postgres;
GRANT ALL ON TABLE public.user_activity TO postgres;
GRANT ALL ON TABLE public.user_activity TO anon;
GRANT ALL ON TABLE public.user_activity TO authenticated;
GRANT ALL ON TABLE public.user_activity TO service_role;


-- public.user_badges definição

-- Drop table

-- DROP TABLE public.user_badges;

CREATE TABLE public.user_badges (
	id uuid NOT NULL,
	badge_id uuid NULL,
	user_id text NOT NULL,
	community_id uuid NOT NULL,
	awarded_at timestamptz DEFAULT now() NULL,
	CONSTRAINT user_badges_pkey PRIMARY KEY (id),
	CONSTRAINT user_badges_user_id_badge_id_community_id_key UNIQUE (user_id, badge_id, community_id),
	CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id),
	CONSTRAINT user_badges_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX user_badges_user_community_idx ON public.user_badges USING btree (user_id, community_id);

-- Permissions

ALTER TABLE public.user_badges OWNER TO postgres;
GRANT ALL ON TABLE public.user_badges TO postgres;
GRANT ALL ON TABLE public.user_badges TO anon;
GRANT ALL ON TABLE public.user_badges TO authenticated;
GRANT ALL ON TABLE public.user_badges TO service_role;


-- public.user_points definição

-- Drop table

-- DROP TABLE public.user_points;

CREATE TABLE public.user_points (
	id serial4 NOT NULL,
	user_id text NOT NULL,
	points int4 DEFAULT 0 NULL,
	last_updated timestamptz DEFAULT now() NULL,
	community_id uuid NULL,
	CONSTRAINT user_points_pkey PRIMARY KEY (id),
	CONSTRAINT user_points_user_community_unique UNIQUE (user_id, community_id),
	CONSTRAINT user_points_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id)
);
CREATE INDEX user_points_user_community_idx ON public.user_points USING btree (user_id, community_id);

-- Permissions

ALTER TABLE public.user_points OWNER TO postgres;
GRANT ALL ON TABLE public.user_points TO postgres;
GRANT ALL ON TABLE public.user_points TO anon;
GRANT ALL ON TABLE public.user_points TO authenticated;
GRANT ALL ON TABLE public.user_points TO service_role;


-- public.content_items definição

-- Drop table

-- DROP TABLE public.content_items;

CREATE TABLE public.content_items (
	id uuid NOT NULL,
	title text NOT NULL,
	description text NULL,
	format text NOT NULL,
	thumbnail text NULL,
	thumbnail_url text NULL,
	resource_url text NULL,
	author text NULL,
	duration int4 NULL,
	tags _text NULL,
	access_level text DEFAULT 'free'::text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	"views" int4 DEFAULT 0 NULL,
	category_id text NULL,
	visibility text DEFAULT 'public'::text NULL,
	featured bool DEFAULT false NULL,
	points_enabled bool DEFAULT false NULL,
	points_value int4 DEFAULT 0 NULL,
	completion_criteria text DEFAULT 'view'::text NULL,
	completion_threshold int4 DEFAULT 80 NULL,
	file_size int4 NULL,
	community_id uuid NULL,
	space_id uuid NULL,
	CONSTRAINT content_items_pkey PRIMARY KEY (id),
	CONSTRAINT content_items_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT content_items_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id)
);
CREATE INDEX content_items_community_id_idx ON public.content_items USING btree (community_id);
CREATE INDEX content_items_space_id_idx ON public.content_items USING btree (space_id);

-- Permissions

ALTER TABLE public.content_items OWNER TO postgres;
GRANT ALL ON TABLE public.content_items TO postgres;
GRANT ALL ON TABLE public.content_items TO anon;
GRANT ALL ON TABLE public.content_items TO authenticated;
GRANT ALL ON TABLE public.content_items TO service_role;


-- public.conversation_members definição

-- Drop table

-- DROP TABLE public.conversation_members;

CREATE TABLE public.conversation_members (
	id uuid NOT NULL,
	conversation_id uuid NULL,
	user_id text NOT NULL,
	"role" text DEFAULT 'member'::text NULL,
	joined_at timestamptz DEFAULT now() NULL,
	last_read_at timestamptz NULL,
	CONSTRAINT conversation_members_conversation_id_user_id_key UNIQUE (conversation_id, user_id),
	CONSTRAINT conversation_members_pkey PRIMARY KEY (id),
	CONSTRAINT conversation_members_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id)
);
CREATE INDEX conversation_members_user_idx ON public.conversation_members USING btree (user_id);

-- Permissions

ALTER TABLE public.conversation_members OWNER TO postgres;
GRANT ALL ON TABLE public.conversation_members TO postgres;
GRANT ALL ON TABLE public.conversation_members TO anon;
GRANT ALL ON TABLE public.conversation_members TO authenticated;
GRANT ALL ON TABLE public.conversation_members TO service_role;


-- public.discussion_topics definição

-- Drop table

-- DROP TABLE public.discussion_topics;

CREATE TABLE public.discussion_topics (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	icon text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	community_id uuid NULL,
	space_id uuid NULL,
	CONSTRAINT discussion_topics_pkey PRIMARY KEY (id),
	CONSTRAINT discussion_topics_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT discussion_topics_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id)
);
CREATE INDEX discussion_topics_community_id_idx ON public.discussion_topics USING btree (community_id);

-- Permissions

ALTER TABLE public.discussion_topics OWNER TO postgres;
GRANT ALL ON TABLE public.discussion_topics TO postgres;
GRANT ALL ON TABLE public.discussion_topics TO anon;
GRANT ALL ON TABLE public.discussion_topics TO authenticated;
GRANT ALL ON TABLE public.discussion_topics TO service_role;


-- public.discussions definição

-- Drop table

-- DROP TABLE public.discussions;

CREATE TABLE public.discussions (
	id uuid NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	topic_id uuid NULL,
	author_id text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	is_pinned bool DEFAULT false NULL,
	view_count int4 DEFAULT 0 NULL,
	is_closed bool DEFAULT false NULL,
	community_id uuid NULL,
	CONSTRAINT discussions_pkey PRIMARY KEY (id),
	CONSTRAINT discussions_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT discussions_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.discussion_topics(id)
);
CREATE INDEX discussions_author_id_idx ON public.discussions USING btree (author_id);
CREATE INDEX discussions_community_id_idx ON public.discussions USING btree (community_id);
CREATE INDEX discussions_topic_id_idx ON public.discussions USING btree (topic_id);

-- Permissions

ALTER TABLE public.discussions OWNER TO postgres;
GRANT ALL ON TABLE public.discussions TO postgres;
GRANT ALL ON TABLE public.discussions TO anon;
GRANT ALL ON TABLE public.discussions TO authenticated;
GRANT ALL ON TABLE public.discussions TO service_role;


-- public.events definição

-- Drop table

-- DROP TABLE public.events;

CREATE TABLE public.events (
	id serial4 NOT NULL,
	title text NOT NULL,
	description text NULL,
	"date" timestamptz NOT NULL,
	"location" text NULL,
	image_url text NULL,
	event_type text NOT NULL,
	capacity int4 NULL,
	is_virtual bool DEFAULT false NULL,
	meeting_link text NULL,
	organizer_id text NULL,
	is_featured bool DEFAULT false NULL,
	points_awarded int4 DEFAULT 0 NULL,
	created_at timestamptz DEFAULT now() NULL,
	community_id uuid NULL,
	space_id uuid NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id),
	CONSTRAINT events_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT events_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id)
);
CREATE INDEX events_community_id_idx ON public.events USING btree (community_id);
CREATE INDEX events_date_idx ON public.events USING btree (date);

-- Permissions

ALTER TABLE public.events OWNER TO postgres;
GRANT ALL ON TABLE public.events TO postgres;
GRANT ALL ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;
GRANT ALL ON TABLE public.events TO service_role;


-- public.message_attachments definição

-- Drop table

-- DROP TABLE public.message_attachments;

CREATE TABLE public.message_attachments (
	id uuid NOT NULL,
	message_id uuid NULL,
	file_url text NOT NULL,
	file_type text NOT NULL,
	file_size int4 NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT message_attachments_pkey PRIMARY KEY (id),
	CONSTRAINT message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id)
);

-- Permissions

ALTER TABLE public.message_attachments OWNER TO postgres;
GRANT ALL ON TABLE public.message_attachments TO postgres;
GRANT ALL ON TABLE public.message_attachments TO anon;
GRANT ALL ON TABLE public.message_attachments TO authenticated;
GRANT ALL ON TABLE public.message_attachments TO service_role;


-- public.post_comments definição

-- Drop table

-- DROP TABLE public.post_comments;

CREATE TABLE public.post_comments (
	id uuid NOT NULL,
	post_id uuid NULL,
	author_id text NOT NULL,
	"content" text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT post_comments_pkey PRIMARY KEY (id),
	CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX post_comments_post_id_idx ON public.post_comments USING btree (post_id);

-- Permissions

ALTER TABLE public.post_comments OWNER TO postgres;
GRANT ALL ON TABLE public.post_comments TO postgres;
GRANT ALL ON TABLE public.post_comments TO anon;
GRANT ALL ON TABLE public.post_comments TO authenticated;
GRANT ALL ON TABLE public.post_comments TO service_role;


-- public.post_reactions definição

-- Drop table

-- DROP TABLE public.post_reactions;

CREATE TABLE public.post_reactions (
	id uuid NOT NULL,
	post_id uuid NULL,
	user_id text NOT NULL,
	reaction_type text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT post_reactions_pkey PRIMARY KEY (id),
	CONSTRAINT post_reactions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX post_reactions_post_id_idx ON public.post_reactions USING btree (post_id);

-- Permissions

ALTER TABLE public.post_reactions OWNER TO postgres;
GRANT ALL ON TABLE public.post_reactions TO postgres;
GRANT ALL ON TABLE public.post_reactions TO anon;
GRANT ALL ON TABLE public.post_reactions TO authenticated;
GRANT ALL ON TABLE public.post_reactions TO service_role;


-- public.redemptions definição

-- Drop table

-- DROP TABLE public.redemptions;

CREATE TABLE public.redemptions (
	id uuid NOT NULL,
	user_id text NOT NULL,
	reward_id uuid NULL,
	redeemed_at timestamptz DEFAULT now() NULL,
	status text DEFAULT 'pending'::text NULL,
	fulfillment_details jsonb NULL,
	community_id uuid NULL,
	CONSTRAINT redemptions_pkey PRIMARY KEY (id),
	CONSTRAINT redemptions_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id),
	CONSTRAINT redemptions_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.rewards(id)
);
CREATE INDEX redemptions_community_id_idx ON public.redemptions USING btree (community_id);
CREATE INDEX redemptions_user_id_idx ON public.redemptions USING btree (user_id);

-- Permissions

ALTER TABLE public.redemptions OWNER TO postgres;
GRANT ALL ON TABLE public.redemptions TO postgres;
GRANT ALL ON TABLE public.redemptions TO anon;
GRANT ALL ON TABLE public.redemptions TO authenticated;
GRANT ALL ON TABLE public.redemptions TO service_role;


-- public.discussion_replies definição

-- Drop table

-- DROP TABLE public.discussion_replies;

CREATE TABLE public.discussion_replies (
	id uuid NOT NULL,
	"content" text NOT NULL,
	discussion_id uuid NULL,
	author_id text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	is_solution bool DEFAULT false NULL,
	CONSTRAINT discussion_replies_pkey PRIMARY KEY (id),
	CONSTRAINT discussion_replies_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id)
);

-- Permissions

ALTER TABLE public.discussion_replies OWNER TO postgres;
GRANT ALL ON TABLE public.discussion_replies TO postgres;
GRANT ALL ON TABLE public.discussion_replies TO anon;
GRANT ALL ON TABLE public.discussion_replies TO authenticated;
GRANT ALL ON TABLE public.discussion_replies TO service_role;


-- public.event_attendees definição

-- Drop table

-- DROP TABLE public.event_attendees;

CREATE TABLE public.event_attendees (
	id serial4 NOT NULL,
	event_id int4 NULL,
	user_id text NOT NULL,
	registered_at timestamptz DEFAULT now() NULL,
	attended bool DEFAULT false NULL,
	feedback text NULL,
	CONSTRAINT event_attendees_event_id_user_id_key UNIQUE (event_id, user_id),
	CONSTRAINT event_attendees_pkey PRIMARY KEY (id),
	CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);

-- Permissions

ALTER TABLE public.event_attendees OWNER TO postgres;
GRANT ALL ON TABLE public.event_attendees TO postgres;
GRANT ALL ON TABLE public.event_attendees TO anon;
GRANT ALL ON TABLE public.event_attendees TO authenticated;
GRANT ALL ON TABLE public.event_attendees TO service_role;