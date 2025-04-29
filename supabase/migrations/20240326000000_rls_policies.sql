-- Create tables first
-- Create content_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  content_id UUID NOT NULL REFERENCES content_items(id),
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_awarded BOOLEAN DEFAULT false,
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS content_progress_user_id_idx ON content_progress(user_id);
CREATE INDEX IF NOT EXISTS content_progress_content_id_idx ON content_progress(content_id);

-- Create content_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  user_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  interaction_type TEXT NOT NULL,
  interaction_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id, interaction_type)
);

CREATE INDEX IF NOT EXISTS content_interactions_content_idx ON content_interactions(content_id);
CREATE INDEX IF NOT EXISTS content_interactions_user_idx ON content_interactions(user_id);
CREATE INDEX IF NOT EXISTS content_interactions_community_idx ON content_interactions(community_id);

-- Create content_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  user_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES content_comments(id)
);

CREATE INDEX IF NOT EXISTS content_comments_content_id_idx ON content_comments(content_id);
CREATE INDEX IF NOT EXISTS content_comments_user_id_idx ON content_comments(user_id);

-- Create courses tables if they don't exist
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  description TEXT,
  curriculum JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_content_id_idx ON courses(content_id);

CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS course_modules_course_id_idx ON course_modules(course_id);

CREATE TABLE IF NOT EXISTS course_module_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  content_id UUID REFERENCES content_items(id),
  duration INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url TEXT,
  resource_url TEXT
);

CREATE INDEX IF NOT EXISTS course_module_items_module_id_idx ON course_module_items(module_id);
CREATE INDEX IF NOT EXISTS course_module_items_content_id_idx ON course_module_items(content_id);

-- Create event_series table if it doesn't exist
CREATE TABLE IF NOT EXISTS event_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS event_series_community_id_idx ON event_series(community_id);

-- Create discussion_topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS discussion_topics (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  space_id UUID REFERENCES spaces(id),
  title TEXT,
  color TEXT,
  slug TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  access_level TEXT CHECK (access_level IN ('free', 'premium', 'premium_plus')),
  discussion_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  recent_activity TIMESTAMP WITH TIME ZONE,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS discussion_topics_community_id_idx ON discussion_topics(community_id);
CREATE INDEX IF NOT EXISTS discussion_topics_space_id_idx ON discussion_topics(space_id);

-- Create discussions table if it doesn't exist
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  topic_id UUID REFERENCES discussion_topics(id),
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  is_closed BOOLEAN DEFAULT false,
  community_id UUID NOT NULL REFERENCES communities(id),
  description TEXT,
  tags TEXT[],
  format TEXT CHECK (format IN ('question', 'discussion', 'announcement')),
  is_locked BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  votes INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  participants INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT false,
  is_answered BOOLEAN DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS discussions_topic_id_idx ON discussions(topic_id);
CREATE INDEX IF NOT EXISTS discussions_community_id_idx ON discussions(community_id);
CREATE INDEX IF NOT EXISTS discussions_author_id_idx ON discussions(author_id);

-- Create discussion_replies table if it doesn't exist
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  discussion_id UUID REFERENCES discussions(id),
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_solution BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES discussion_replies(id),
  is_answer BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  is_accepted_answer BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS discussion_replies_discussion_id_idx ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS discussion_replies_author_id_idx ON discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS discussion_replies_parent_id_idx ON discussion_replies(parent_id);

-- Create discussion_votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS discussion_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES discussions(id),
  user_id TEXT NOT NULL,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

CREATE INDEX IF NOT EXISTS discussion_votes_discussion_id_idx ON discussion_votes(discussion_id);
CREATE INDEX IF NOT EXISTS discussion_votes_user_id_idx ON discussion_votes(user_id);

-- Create points_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS points_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) UNIQUE,
  activity_rewards JSONB NOT NULL,
  redemption_enabled BOOLEAN DEFAULT true,
  welcome_bonus INTEGER DEFAULT 0,
  referral_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS points_settings_community_id_idx ON points_settings(community_id);

-- Create communities table if it doesn't exist
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  domain TEXT,
  creator_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  theme_config JSONB,
  api_keys JSONB,
  slug TEXT NOT NULL,
  primary_color TEXT,
  secondary_color TEXT,
  is_public BOOLEAN DEFAULT true,
  owner_id TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS communities_slug_idx ON communities(slug);

-- Create community_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS community_settings (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  settings_type TEXT NOT NULL,
  settings_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, settings_type)
);

-- Create community_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  subscription_plan_id UUID,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  custom_fields JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points NUMBER DEFAULT 0,
  UNIQUE(community_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_members_community_id_idx ON community_members(community_id);
CREATE INDEX IF NOT EXISTS community_members_user_id_idx ON community_members(user_id);

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  interval TEXT DEFAULT 'month',
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  trial_days INTEGER,
  max_members INTEGER,
  visibility TEXT DEFAULT 'public',
  progressive_content BOOLEAN DEFAULT false,
  retention_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscription_plans_community_id_idx ON subscription_plans(community_id);

-- Create spaces table if it doesn't exist
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  icon TEXT,
  banner_url TEXT,
  config JSONB,
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS spaces_community_id_idx ON spaces(community_id);

-- Create payment_gateways table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_gateways (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  gateway_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, gateway_type)
);

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, role, resource, action)
);

-- Create content_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  title TEXT NOT NULL,
  description TEXT,
  format TEXT NOT NULL,
  thumbnail TEXT,
  thumbnail_url TEXT,
  resource_url TEXT,
  author TEXT,
  duration INTEGER,
  tags TEXT[],
  access_level TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  category_id TEXT,
  visibility TEXT DEFAULT 'public',
  featured BOOLEAN DEFAULT false,
  points_enabled BOOLEAN DEFAULT false,
  points_value INTEGER DEFAULT 0,
  completion_criteria TEXT DEFAULT 'view',
  completion_threshold INTEGER DEFAULT 80,
  file_size INTEGER,
  space_id UUID REFERENCES spaces(id),
  url TEXT,
  likes INTEGER DEFAULT 0,
  author_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  content TEXT,
  is_new BOOLEAN DEFAULT false,
  freeAccessesLeft INTEGER DEFAULT 0,
  isExclusive BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS content_items_community_id_idx ON content_items(community_id);
CREATE INDEX IF NOT EXISTS content_items_space_id_idx ON content_items(space_id);
CREATE INDEX IF NOT EXISTS content_items_author_id_idx ON content_items(author_id);
CREATE INDEX IF NOT EXISTS content_items_format_idx ON content_items(format);
CREATE INDEX IF NOT EXISTS content_items_category_id_idx ON content_items(category_id);

-- Create content_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_categories (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES content_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0,
  slug TEXT,
  icon TEXT,
  color TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  item_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS content_categories_community_id_idx ON content_categories(community_id);
CREATE INDEX IF NOT EXISTS content_categories_parent_id_idx ON content_categories(parent_id);

-- Create user_points table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_points (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  points INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

CREATE INDEX IF NOT EXISTS user_points_user_community_idx ON user_points(user_id, community_id);

-- Create points_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  points INTEGER NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reference_id TEXT,
  reference_type TEXT,
  activity_type TEXT,
  entity_id TEXT,
  entity_type TEXT,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS points_transactions_user_id_idx ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS points_transactions_community_id_idx ON points_transactions(community_id);
CREATE INDEX IF NOT EXISTS points_transactions_user_community_idx ON points_transactions(user_id, community_id);

-- Create rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  points_cost INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  quantity_available INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  redemption_instructions TEXT,
  reward_type TEXT,
  title TEXT,
  stock INTEGER,
  redeem_count INTEGER DEFAULT 0,
  action_url TEXT,
  visibility TEXT,
  category_id TEXT
);

CREATE INDEX IF NOT EXISTS rewards_community_id_idx ON rewards(community_id);

-- Create redemptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  reward_id UUID REFERENCES rewards(id),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  fulfillment_details JSONB,
  community_id UUID NOT NULL REFERENCES communities(id),
  points_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS redemptions_user_id_idx ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS redemptions_community_id_idx ON redemptions(community_id);
CREATE INDEX IF NOT EXISTS redemptions_reward_id_idx ON redemptions(reward_id);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  role TEXT,
  access_level TEXT CHECK (access_level IN ('free', 'premium', 'premium_plus'))
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Helper functions
-- Helper function to get current community context
CREATE OR REPLACE FUNCTION get_current_community_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin/owner
CREATE OR REPLACE FUNCTION is_admin_or_owner(community_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = $1
    AND user_id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is moderator
CREATE OR REPLACE FUNCTION is_moderator(community_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = $1
    AND user_id = auth.uid()
    AND role = 'moderator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_module_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Finally add all policies
-- Communities table policies
CREATE POLICY "Public communities are viewable by anyone" ON communities
  FOR SELECT USING (is_public = true);

CREATE POLICY "Private communities are viewable by members" ON communities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Only owners can update communities" ON communities
  FOR UPDATE USING (owner_id = auth.uid());

-- Community members policies
CREATE POLICY "Members can view other members in their community" ON community_members
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Admins can manage members" ON community_members
  FOR ALL USING (is_admin_or_owner(community_id));

-- Content policies
CREATE POLICY "Members can view content in their community" ON content_items
  FOR SELECT USING (
    community_id = get_current_community_id()
    AND (
      access_level = 'free'
      OR (
        access_level = 'premium'
        AND EXISTS (
          SELECT 1 FROM community_members
          WHERE community_id = content_items.community_id
          AND user_id = auth.uid()
          AND subscription_plan_id IS NOT NULL
          AND subscription_end_date > NOW()
        )
      )
    )
  );

CREATE POLICY "Admins can manage content" ON content_items
  FOR ALL USING (is_admin_or_owner(community_id));

-- Discussions policies
CREATE POLICY "Members can view discussions" ON discussions
  FOR SELECT USING (
    community_id = get_current_community_id()
    AND (
      is_private = false
      OR EXISTS (
        SELECT 1 FROM community_members
        WHERE community_id = discussions.community_id
        AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can create discussions" ON discussions
  FOR INSERT WITH CHECK (
    community_id = get_current_community_id()
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can manage their discussions" ON discussions
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Moderators can manage all discussions" ON discussions
  FOR ALL USING (is_moderator(community_id) OR is_admin_or_owner(community_id));

-- Events policies
CREATE POLICY "Members can view events" ON events
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (is_admin_or_owner(community_id));

-- Points policies
CREATE POLICY "Users can view their own points" ON user_points
  FOR SELECT USING (
    user_id = auth.uid()
    AND community_id = get_current_community_id()
  );

CREATE POLICY "System can manage points" ON user_points
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their points transactions" ON points_transactions
  FOR SELECT USING (
    user_id = auth.uid()
    AND community_id = get_current_community_id()
  );

-- Posts policies
CREATE POLICY "Members can view posts" ON posts
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Members can create posts" ON posts
  FOR INSERT WITH CHECK (
    community_id = get_current_community_id()
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can update their posts" ON posts
  FOR UPDATE USING (
    author_id = auth.uid()
    AND community_id = get_current_community_id()
  );

CREATE POLICY "Moderators can manage posts" ON posts
  FOR ALL USING (
    is_moderator(community_id) OR is_admin_or_owner(community_id)
  );

-- Comments policies
CREATE POLICY "Members can view comments" ON post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_comments.post_id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Members can create comments" ON post_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_comments.post_id
      AND community_id = get_current_community_id()
    )
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can manage their comments" ON post_comments
  FOR ALL USING (author_id = auth.uid());

-- Reactions policies
CREATE POLICY "Members can view reactions" ON post_reactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_reactions.post_id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Members can manage their reactions" ON post_reactions
  FOR ALL USING (user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Profiles are viewable by community members" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = profiles.id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Content progress policies
CREATE POLICY "Users can view their own progress" ON content_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON content_progress
  FOR ALL USING (user_id = auth.uid());

-- Content interactions policies
CREATE POLICY "Users can view interactions in their community" ON content_interactions
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Users can create interactions" ON content_interactions
  FOR INSERT WITH CHECK (
    community_id = get_current_community_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can manage their own interactions" ON content_interactions
  FOR UPDATE USING (
    user_id = auth.uid()
    AND community_id = get_current_community_id()
  );

CREATE POLICY "Admins can manage all interactions" ON content_interactions
  FOR ALL USING (is_admin_or_owner(community_id));

-- Content comments policies
CREATE POLICY "Members can view comments on content" ON content_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_items
      WHERE id = content_comments.content_id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Members can create comments" ON content_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM content_items
      WHERE id = content_comments.content_id
      AND community_id = get_current_community_id()
    )
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can manage their comments" ON content_comments
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Moderators can manage all comments" ON content_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM content_items ci
      WHERE ci.id = content_comments.content_id
      AND (is_moderator(ci.community_id) OR is_admin_or_owner(ci.community_id))
    )
  );

-- Event series policies
CREATE POLICY "Members can view event series" ON event_series
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Admins can manage event series" ON event_series
  FOR ALL USING (is_admin_or_owner(community_id));

-- Discussion topics policies
CREATE POLICY "Members can view discussion topics" ON discussion_topics
  FOR SELECT USING (
    community_id = get_current_community_id()
    AND (
      is_private = false
      OR EXISTS (
        SELECT 1 FROM community_members
        WHERE community_id = discussion_topics.community_id
        AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage discussion topics" ON discussion_topics
  FOR ALL USING (is_admin_or_owner(community_id));

-- Discussion replies policies
CREATE POLICY "Members can view discussion replies" ON discussion_replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM discussions
      WHERE id = discussion_replies.discussion_id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Members can create replies" ON discussion_replies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM discussions
      WHERE id = discussion_replies.discussion_id
      AND community_id = get_current_community_id()
    )
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authors can manage their replies" ON discussion_replies
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Moderators can manage all replies" ON discussion_replies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM discussions d
      WHERE d.id = discussion_replies.discussion_id
      AND (is_moderator(d.community_id) OR is_admin_or_owner(d.community_id))
    )
  );

-- Discussion votes policies
CREATE POLICY "Members can view votes" ON discussion_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM discussions
      WHERE id = discussion_votes.discussion_id
      AND community_id = get_current_community_id()
    )
  );

CREATE POLICY "Members can manage their own votes" ON discussion_votes
  FOR ALL USING (user_id = auth.uid());

-- Points settings policies
CREATE POLICY "Members can view points settings" ON points_settings
  FOR SELECT USING (community_id = get_current_community_id());

CREATE POLICY "Admins can manage points settings" ON points_settings
  FOR ALL USING (is_admin_or_owner(community_id)); 