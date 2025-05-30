-- =====================================================
-- AUTOMATIC POINTS TRIGGERS
-- =====================================================

-- Function to automatically award points for actions
CREATE OR REPLACE FUNCTION auto_award_points()
RETURNS TRIGGER AS $$
DECLARE
  action_config RECORD;
  community_id_val UUID;
  user_points_today INTEGER;
BEGIN
  -- Determine the community ID based on the table
  CASE TG_TABLE_NAME
    WHEN 'posts' THEN
      community_id_val := NEW.community_id;
    WHEN 'comments' THEN
      -- Get community_id from the post that was commented on
      SELECT community_id INTO community_id_val 
      FROM posts WHERE id = NEW.post_id;
    WHEN 'likes' THEN
      -- Get community_id from the post that was liked
      SELECT community_id INTO community_id_val 
      FROM posts WHERE id = NEW.post_id;
    WHEN 'profiles' THEN
      -- For profile completion, we need to check if user is in any community
      -- For now, skip auto-awarding for profile updates
      RETURN NEW;
    ELSE
      RETURN NEW;
  END CASE;

  -- Get the points configuration for this action type
  SELECT * INTO action_config 
  FROM points_actions 
  WHERE community_id = community_id_val 
    AND action_type = TG_ARGV[0]
    AND is_enabled = true;

  -- If no configuration found or not enabled, skip
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Check daily limits if configured
  IF action_config.daily_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO user_points_today
    FROM points_transactions 
    WHERE user_id = NEW.user_id 
      AND community_id = community_id_val 
      AND source = TG_ARGV[0]
      AND created_at >= CURRENT_DATE;
    
    IF user_points_today >= action_config.daily_limit THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Award the points using our function
  PERFORM add_points(
    NEW.user_id,
    community_id_val,
    action_config.points_awarded,
    action_config.description,
    TG_ARGV[0]
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new posts
CREATE TRIGGER auto_points_post_create
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_award_points('post_create');

-- Trigger for new comments
CREATE TRIGGER auto_points_comment_create
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION auto_award_points('comment_create');

-- Trigger for likes (assuming you have a likes table)
-- Uncomment when likes table exists
-- CREATE TRIGGER auto_points_like_give
--   AFTER INSERT ON likes
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_award_points('like_give');

-- =====================================================
-- DAILY LOGIN BONUS FUNCTION
-- =====================================================

-- Function to award daily login bonus
CREATE OR REPLACE FUNCTION award_daily_login_bonus(user_id UUID, community_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  action_config RECORD;
  last_login_today BOOLEAN;
BEGIN
  -- Get the daily login configuration
  SELECT * INTO action_config 
  FROM points_actions 
  WHERE community_id = award_daily_login_bonus.community_id 
    AND action_type = 'daily_login'
    AND is_enabled = true;

  -- If no configuration found, skip
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check if user already got login bonus today
  SELECT EXISTS(
    SELECT 1 FROM points_transactions 
    WHERE user_id = award_daily_login_bonus.user_id 
      AND community_id = award_daily_login_bonus.community_id 
      AND source = 'daily_login'
      AND created_at >= CURRENT_DATE
  ) INTO last_login_today;

  -- If already got bonus today, skip
  IF last_login_today THEN
    RETURN FALSE;
  END IF;

  -- Award the daily login bonus
  PERFORM add_points(
    award_daily_login_bonus.user_id,
    award_daily_login_bonus.community_id,
    action_config.points_awarded,
    action_config.description,
    'daily_login'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- LEVEL UP DETECTION
-- =====================================================

-- Function to check for level ups and award badges
CREATE OR REPLACE FUNCTION check_level_up()
RETURNS TRIGGER AS $$
DECLARE
  old_level INTEGER;
  new_level INTEGER;
BEGIN
  -- Calculate levels (100 points per level)
  old_level := COALESCE(OLD.level, 1);
  new_level := GREATEST(1, (NEW.points / 100) + 1);

  -- If level increased, award a badge
  IF new_level > old_level THEN
    INSERT INTO user_badges (user_id, community_id, badge_name, badge_description, badge_category, badge_icon)
    VALUES (
      NEW.user_id,
      NEW.community_id,
      'Level ' || new_level,
      'Reached level ' || new_level || ' in the community',
      'level',
      '🏆'
    )
    ON CONFLICT (user_id, community_id, badge_name) DO NOTHING;
  END IF;

  -- Update the level
  NEW.level := new_level;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for level up detection
CREATE TRIGGER check_level_up_trigger
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION check_level_up();

-- =====================================================
-- MILESTONE BADGES
-- =====================================================

-- Function to award milestone badges
CREATE OR REPLACE FUNCTION award_milestone_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Award badges for point milestones
  CASE 
    WHEN NEW.total_earned >= 1000 AND OLD.total_earned < 1000 THEN
      INSERT INTO user_badges (user_id, community_id, badge_name, badge_description, badge_category, badge_icon)
      VALUES (NEW.user_id, NEW.community_id, 'Point Collector', 'Earned 1,000 total points', 'milestone', '💎')
      ON CONFLICT (user_id, community_id, badge_name) DO NOTHING;
    
    WHEN NEW.total_earned >= 5000 AND OLD.total_earned < 5000 THEN
      INSERT INTO user_badges (user_id, community_id, badge_name, badge_description, badge_category, badge_icon)
      VALUES (NEW.user_id, NEW.community_id, 'Point Master', 'Earned 5,000 total points', 'milestone', '💰')
      ON CONFLICT (user_id, community_id, badge_name) DO NOTHING;
    
    WHEN NEW.total_earned >= 10000 AND OLD.total_earned < 10000 THEN
      INSERT INTO user_badges (user_id, community_id, badge_name, badge_description, badge_category, badge_icon)
      VALUES (NEW.user_id, NEW.community_id, 'Point Legend', 'Earned 10,000 total points', 'milestone', '👑')
      ON CONFLICT (user_id, community_id, badge_name) DO NOTHING;
    ELSE
      -- No milestone reached
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for milestone badges
CREATE TRIGGER award_milestone_badges_trigger
  AFTER UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION award_milestone_badges();

-- =====================================================
-- SEED SAMPLE REWARDS
-- =====================================================

-- Function to add sample rewards to a community
CREATE OR REPLACE FUNCTION seed_sample_rewards(community_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rewards (community_id, title, description, cost_points, category, image_url) VALUES
  (community_id, '🎁 Community Sticker Pack', 'Exclusive community stickers for your laptop', 100, 'merchandise'),
  (community_id, '☕ Coffee Chat with Admin', '30-minute 1-on-1 coffee chat with community admin', 250, 'experience'),
  (community_id, '🏆 Feature Your Content', 'Get your next post featured on community homepage', 150, 'promotion'),
  (community_id, '👑 VIP Badge for 30 Days', 'Show off your VIP status with a special badge', 300, 'status'),
  (community_id, '📚 Free Course Access', 'Access to any premium course in the community', 500, 'education'),
  (community_id, '🎮 Custom Discord Role', 'Get a custom role in the community Discord', 200, 'status'),
  (community_id, '🎯 Skip the Queue', 'Jump to the front of any community event waitlist', 180, 'privilege'),
  (community_id, '💬 Ask Me Anything Session', 'Host your own AMA session for the community', 400, 'experience')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 