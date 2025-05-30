-- =====================================================
-- GAMIFICATION SYSTEM - COMPLETE TABLES
-- =====================================================

-- 1. User Points Tracking
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  total_earned INTEGER DEFAULT 0 NOT NULL,
  total_spent INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, community_id),
  CHECK (points >= 0),
  CHECK (level >= 1)
);

-- 2. Points Transactions History
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  source TEXT DEFAULT 'manual',
  transaction_type TEXT DEFAULT 'earned' CHECK (transaction_type IN ('earned', 'spent', 'adjustment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional context
  related_entity_type TEXT, -- 'post', 'comment', 'event', 'purchase', etc.
  related_entity_id UUID
);

-- 3. Points Actions Configuration (Admin Setup)
CREATE TABLE IF NOT EXISTS points_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'post_create', 'comment_create', 'login', etc.
  points_awarded INTEGER NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  daily_limit INTEGER, -- NULL = no limit
  weekly_limit INTEGER,
  monthly_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(community_id, action_type)
);

-- 4. Rewards Store Items
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cost_points INTEGER NOT NULL,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER, -- NULL = unlimited
  max_per_user INTEGER, -- NULL = unlimited per user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (cost_points > 0),
  CHECK (stock_quantity IS NULL OR stock_quantity >= 0)
);

-- 5. Reward Redemptions
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  redemption_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- 6. User Badges/Achievements
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_category TEXT DEFAULT 'achievement',
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, community_id, badge_name)
);

-- 7. Points Challenges/Quests
CREATE TABLE IF NOT EXISTS points_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points_reward INTEGER NOT NULL,
  challenge_type TEXT DEFAULT 'manual' CHECK (challenge_type IN ('manual', 'automatic', 'daily', 'weekly', 'monthly')),
  target_value INTEGER, -- Target number (posts, comments, etc.)
  target_metric TEXT, -- What to measure ('posts_created', 'comments_made', etc.)
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES points_challenges(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, challenge_id),
  CHECK (current_progress >= 0)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS user_points_user_community_idx ON user_points(user_id, community_id);
CREATE INDEX IF NOT EXISTS points_transactions_user_idx ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS points_transactions_community_idx ON points_transactions(community_id);
CREATE INDEX IF NOT EXISTS points_transactions_created_at_idx ON points_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS points_actions_community_idx ON points_actions(community_id);
CREATE INDEX IF NOT EXISTS rewards_community_idx ON rewards(community_id);
CREATE INDEX IF NOT EXISTS rewards_available_idx ON rewards(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS reward_redemptions_user_idx ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS user_badges_user_community_idx ON user_badges(user_id, community_id);
CREATE INDEX IF NOT EXISTS points_challenges_community_idx ON points_challenges(community_id);
CREATE INDEX IF NOT EXISTS points_challenges_active_idx ON points_challenges(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS user_challenge_progress_user_idx ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS user_challenge_progress_challenge_idx ON user_challenge_progress(challenge_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- User Points Policies
CREATE POLICY "Users can view their own points" 
ON user_points FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can view points in their communities" 
ON user_points FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

-- Points Transactions Policies
CREATE POLICY "Users can view their own transactions" 
ON points_transactions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Community owners can view all transactions" 
ON points_transactions FOR SELECT 
USING (
  community_id IN (
    SELECT id 
    FROM communities 
    WHERE creator_id = auth.uid()
  )
);

-- Points Actions Policies (Admin only)
CREATE POLICY "Community owners can manage points actions" 
ON points_actions FOR ALL 
USING (
  community_id IN (
    SELECT id 
    FROM communities 
    WHERE creator_id = auth.uid()
  )
);

CREATE POLICY "Members can view community points actions" 
ON points_actions FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

-- Rewards Policies
CREATE POLICY "Members can view available rewards" 
ON rewards FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Community owners can manage rewards" 
ON rewards FOR ALL 
USING (
  community_id IN (
    SELECT id 
    FROM communities 
    WHERE creator_id = auth.uid()
  )
);

-- Reward Redemptions Policies
CREATE POLICY "Users can view their own redemptions" 
ON reward_redemptions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create redemptions" 
ON reward_redemptions FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Community owners can view all redemptions" 
ON reward_redemptions FOR SELECT 
USING (
  reward_id IN (
    SELECT id 
    FROM rewards 
    WHERE community_id IN (
      SELECT id 
      FROM communities 
      WHERE creator_id = auth.uid()
    )
  )
);

-- User Badges Policies
CREATE POLICY "Users can view their own badges" 
ON user_badges FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Members can view community badges" 
ON user_badges FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

-- Challenges Policies
CREATE POLICY "Members can view active challenges" 
ON points_challenges FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Community owners can manage challenges" 
ON points_challenges FOR ALL 
USING (
  community_id IN (
    SELECT id 
    FROM communities 
    WHERE creator_id = auth.uid()
  )
);

-- Challenge Progress Policies
CREATE POLICY "Users can view their own progress" 
ON user_challenge_progress FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" 
ON user_challenge_progress FOR ALL 
USING (user_id = auth.uid());

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to add points to a user
CREATE OR REPLACE FUNCTION add_points(
  user_id UUID,
  community_id UUID,
  points_to_add INTEGER,
  description TEXT DEFAULT 'Points awarded',
  source TEXT DEFAULT 'system'
)
RETURNS VOID AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO points_transactions (user_id, community_id, points, description, source, transaction_type)
  VALUES (user_id, community_id, points_to_add, description, source, 'earned');
  
  -- Update user points total
  INSERT INTO user_points (user_id, community_id, points, total_earned)
  VALUES (user_id, community_id, points_to_add, points_to_add)
  ON CONFLICT (user_id, community_id)
  DO UPDATE SET 
    points = user_points.points + points_to_add,
    total_earned = user_points.total_earned + points_to_add,
    level = GREATEST(1, ((user_points.points + points_to_add) / 100) + 1),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to spend points
CREATE OR REPLACE FUNCTION spend_points(
  user_id UUID,
  community_id UUID,
  points_to_spend INTEGER,
  description TEXT DEFAULT 'Points spent'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_points INTEGER;
BEGIN
  -- Get current points
  SELECT points INTO current_points 
  FROM user_points 
  WHERE user_points.user_id = spend_points.user_id 
    AND user_points.community_id = spend_points.community_id;
  
  -- Check if user has enough points
  IF current_points IS NULL OR current_points < points_to_spend THEN
    RETURN FALSE;
  END IF;
  
  -- Insert transaction record
  INSERT INTO points_transactions (user_id, community_id, points, description, transaction_type)
  VALUES (user_id, community_id, -points_to_spend, description, 'spent');
  
  -- Update user points total
  UPDATE user_points 
  SET 
    points = points - points_to_spend,
    total_spent = total_spent + points_to_spend,
    updated_at = NOW()
  WHERE user_points.user_id = spend_points.user_id 
    AND user_points.community_id = spend_points.community_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Function to setup default points actions for a community
CREATE OR REPLACE FUNCTION setup_default_points_actions(community_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO points_actions (community_id, action_type, points_awarded, description, daily_limit) VALUES
  (community_id, 'post_create', 10, 'Create a new post', 3),
  (community_id, 'comment_create', 5, 'Comment on a post', 10),
  (community_id, 'like_give', 1, 'Like a post or comment', 50),
  (community_id, 'daily_login', 2, 'Daily login bonus', 1),
  (community_id, 'profile_complete', 15, 'Complete profile information', NULL),
  (community_id, 'event_attend', 20, 'Attend a community event', NULL),
  (community_id, 'course_complete', 50, 'Complete a course', NULL),
  (community_id, 'challenge_complete', 25, 'Complete a challenge', NULL)
  ON CONFLICT (community_id, action_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_user_points_updated_at 
BEFORE UPDATE ON user_points 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_points_actions_updated_at 
BEFORE UPDATE ON points_actions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at 
BEFORE UPDATE ON rewards 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 