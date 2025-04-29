Esquema do Banco de Dados
Tabelas Principais
communities

CREATE TABLE communities (
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

CREATE INDEX communities_slug_idx ON communities(slug);
community_settings

CREATE TABLE community_settings (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  settings_type TEXT NOT NULL,
  settings_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, settings_type)
);
community_members

CREATE TABLE community_members (
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

CREATE INDEX community_members_community_id_idx ON community_members(community_id);
CREATE INDEX community_members_user_id_idx ON community_members(user_id);
subscription_plans

CREATE TABLE subscription_plans (
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

CREATE INDEX subscription_plans_community_id_idx ON subscription_plans(community_id);
spaces

CREATE TABLE spaces (
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

CREATE INDEX spaces_community_id_idx ON spaces(community_id);
payment_gateways

CREATE TABLE payment_gateways (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  gateway_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, gateway_type)
);
permissions

CREATE TABLE permissions (
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
Conteúdo e Biblioteca
content_items

CREATE TABLE content_items (
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

CREATE INDEX content_items_community_id_idx ON content_items(community_id);
CREATE INDEX content_items_space_id_idx ON content_items(space_id);
CREATE INDEX content_items_author_id_idx ON content_items(author_id);
CREATE INDEX content_items_format_idx ON content_items(format);
CREATE INDEX content_items_category_id_idx ON content_items(category_id);
content_categories

CREATE TABLE content_categories (
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

CREATE INDEX content_categories_community_id_idx ON content_categories(community_id);
CREATE INDEX content_categories_parent_id_idx ON content_categories(parent_id);
content_progress

CREATE TABLE content_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  content_id UUID NOT NULL REFERENCES content_items(id),
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_awarded BOOLEAN DEFAULT false,
  UNIQUE(user_id, content_id)
);

CREATE INDEX content_progress_user_id_idx ON content_progress(user_id);
CREATE INDEX content_progress_content_id_idx ON content_progress(content_id);
content_interactions

CREATE TABLE content_interactions (
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

CREATE INDEX content_interactions_content_idx ON content_interactions(content_id);
CREATE INDEX content_interactions_user_idx ON content_interactions(user_id);
CREATE INDEX content_interactions_community_idx ON content_interactions(community_id);
content_comments

CREATE TABLE content_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  user_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES content_comments(id)
);

CREATE INDEX content_comments_content_id_idx ON content_comments(content_id);
CREATE INDEX content_comments_user_id_idx ON content_comments(user_id);
Cursos
courses

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  description TEXT,
  curriculum JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX courses_content_id_idx ON courses(content_id);
course_modules

CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX course_modules_course_id_idx ON course_modules(course_id);
course_module_items

CREATE TABLE course_module_items (
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

CREATE INDEX course_module_items_module_id_idx ON course_module_items(module_id);
CREATE INDEX course_module_items_content_id_idx ON course_module_items(content_id);
Eventos
events

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  event_type TEXT NOT NULL,
  capacity INTEGER,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  organizer_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  space_id UUID REFERENCES spaces(id),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  timezone TEXT,
  location_type TEXT CHECK (location_type IN ('online', 'in_person', 'hybrid')),
  location_url TEXT,
  location_address TEXT,
  location_details TEXT,
  max_attendees INTEGER,
  access_level TEXT CHECK (access_level IN ('free', 'premium', 'premium_plus')),
  speaker_id TEXT,
  speaker_name TEXT,
  speaker_bio TEXT,
  speaker_avatar TEXT,
  banner_url TEXT,
  points_value INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX events_community_id_idx ON events(community_id);
CREATE INDEX events_date_idx ON events(date);
CREATE INDEX events_space_id_idx ON events(space_id);
event_attendees

CREATE TABLE event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  user_id TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  feedback TEXT,
  status TEXT CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled', 'no_show')),
  notes TEXT,
  registration_date TIMESTAMP WITH TIME ZONE,
  checkin_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX event_attendees_event_id_idx ON event_attendees(event_id);
CREATE INDEX event_attendees_user_id_idx ON event_attendees(user_id);
event_series

CREATE TABLE event_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX event_series_community_id_idx ON event_series(community_id);
Discussões e Posts
discussion_topics

CREATE TABLE discussion_topics (
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

CREATE INDEX discussion_topics_community_id_idx ON discussion_topics(community_id);
CREATE INDEX discussion_topics_space_id_idx ON discussion_topics(space_id);
discussions

CREATE TABLE discussions (
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

CREATE INDEX discussions_topic_id_idx ON discussions(topic_id);
CREATE INDEX discussions_community_id_idx ON discussions(community_id);
CREATE INDEX discussions_author_id_idx ON discussions(author_id);
discussion_replies

CREATE TABLE discussion_replies (
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

CREATE INDEX discussion_replies_discussion_id_idx ON discussion_replies(discussion_id);
CREATE INDEX discussion_replies_author_id_idx ON discussion_replies(author_id);
CREATE INDEX discussion_replies_parent_id_idx ON discussion_replies(parent_id);
discussion_votes

CREATE TABLE discussion_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES discussions(id),
  user_id TEXT NOT NULL,
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

CREATE INDEX discussion_votes_discussion_id_idx ON discussion_votes(discussion_id);
CREATE INDEX discussion_votes_user_id_idx ON discussion_votes(user_id);
posts

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  media_urls TEXT[],
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  type TEXT NOT NULL,
  status TEXT DEFAULT 'published',
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  space_id UUID REFERENCES spaces(id),
  pinned BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  visibility TEXT DEFAULT 'public',
  location JSONB
);

CREATE INDEX posts_community_id_idx ON posts(community_id);
CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX posts_space_id_idx ON posts(space_id);
post_comments

CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE
);

CREATE INDEX post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX post_comments_author_id_idx ON post_comments(author_id);
CREATE INDEX post_comments_parent_id_idx ON post_comments(parent_id);
post_reactions

CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX post_reactions_post_id_idx ON post_reactions(post_id);
CREATE INDEX post_reactions_user_id_idx ON post_reactions(user_id);
Sistema de Pontos
user_points

CREATE TABLE user_points (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id),
  points INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

CREATE INDEX user_points_user_community_idx ON user_points(user_id, community_id);
points_transactions

CREATE TABLE points_transactions (
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

CREATE INDEX points_transactions_user_id_idx ON points_transactions(user_id);
CREATE INDEX points_transactions_community_id_idx ON points_transactions(community_id);
CREATE INDEX points_transactions_user_community_idx ON points_transactions(user_id, community_id);
rewards

CREATE TABLE rewards (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  redeem_count INTEGER DEFAULT 0,
  action_url TEXT,
  visibility TEXT,
  category_id TEXT
);

CREATE INDEX rewards_community_id_idx ON rewards(community_id);
redemptions

CREATE TABLE redemptions (
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

CREATE INDEX redemptions_user_id_idx ON redemptions(user_id);
CREATE INDEX redemptions_community_id_idx ON redemptions(community_id);
CREATE INDEX redemptions_reward_id_idx ON redemptions(reward_id);
points_settings

CREATE TABLE points_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) UNIQUE,
  activity_rewards JSONB NOT NULL,
  redemption_enabled BOOLEAN DEFAULT true,
  welcome_bonus INTEGER DEFAULT 0,
  referral_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX points_settings_community_id_idx ON points_settings(community_id);
Usuários e Perfis
profiles

CREATE TABLE profiles (
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

CREATE INDEX profiles_email_idx ON profiles(email);
Funções SQL Importantes

-- Incrementar visualizações de conteúdo
CREATE OR REPLACE FUNCTION increment_content_views(content_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE content_items
  SET views = views + 1
  WHERE id = content_id_param;
END;
$$ LANGUAGE plpgsql;

-- Incrementar visualizações de discussão
CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id_param;
END;
$$ LANGUAGE plpgsql;

-- Incrementar comentários de post
CREATE OR REPLACE FUNCTION increment_post_comments(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET comment_count = comment_count + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- Decrementar comentários de post
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- Adicionar pontos a um usuário
CREATE OR REPLACE FUNCTION add_points(user_id TEXT, community_id UUID, points_to_add INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_points INTEGER;
BEGIN
  INSERT INTO user_points (user_id, community_id, points)
  VALUES (user_id, community_id, points_to_add)
  ON CONFLICT (user_id, community_id) DO UPDATE
  SET points = user_points.points + points_to_add,
      last_updated = NOW()
  RETURNING points INTO current_points;
  
  RETURN current_points;
END;
$$ LANGUAGE plpgsql;

-- Funções para contexto de tenant
CREATE OR REPLACE FUNCTION set_tenant_context(community_uuid UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant', community_uuid::text, false);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_tenant_context()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL::UUID;
END;
$$ LANGUAGE plpgsql;
