-- Single script to clean and seed all data
BEGIN;

-- First clean all tables in correct dependency order
-- TRUNCATE TABLE 
--     public.discussion_replies,
--     public.message_attachments,
--     public.post_reactions,
--     public.post_comments,
--     public.event_attendees,
--     public.redemptions,
--     public.discussions,
--     public.messages,
--     public.posts,
--     public.events,
--     public.discussion_topics,
--     public.conversation_members,
--     public.content_items,
--     public.conversations,
--     public.spaces,
--     public.user_badges,
--     public.user_points,
--     public.points_activities,
--     public.user_activity,
--     public.analytics_events,
--     public.notifications,
--     public.notification_settings,
--     public.community_settings,
--     public.permissions,
--     public.payment_gateways,
--     public.community_members,
--     public.content_categories,
--     public.level_configs,
--     public.badges,
--     public.rewards,
--     public.subscription_plans,
--     public.communities
-- CASCADE;

-- Helper function to generate UUID v4
CREATE OR REPLACE FUNCTION generate_uuid_v4()
RETURNS uuid AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

-- 1. Insert base communities first
INSERT INTO public.communities (id, name, description, domain, creator_id, status, theme_config, api_keys, is_private)
SELECT
    generate_uuid_v4(),
    name,
    description,
    domain,
    creator_id,
    'active',
    theme_config,
    '{}'::jsonb,
    false
FROM (
    VALUES 
        ('Tech Learning Hub', 'A community for tech enthusiasts', 'tech-learning-hub', 'sample_creator_1', '{"primaryColor": "#6366F1", "secondaryColor": "#4F46E5"}'::jsonb),
        ('Design Masters', 'For UX/UI designers', 'design-masters', 'sample_creator_2', '{"primaryColor": "#EC4899", "secondaryColor": "#DB2777"}'::jsonb),
        ('Data Science Academy', 'Learn data science and analytics', 'data-science-academy', 'sample_creator_3', '{"primaryColor": "#10B981", "secondaryColor": "#059669"}'::jsonb)
) AS v(name, description, domain, creator_id, theme_config);

-- 2. Insert subscription plans
INSERT INTO public.subscription_plans (id, community_id, name, description, price, interval, features, is_active)
SELECT
    generate_uuid_v4(),
    c.id,
    p.plan_name,
    p.plan_description,
    p.price,
    'month',
    p.features,
    true
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Basic', 'Access to basic features', 0, '{"features": ["Basic content access", "Community forums", "Public events"]}'::jsonb),
        ('Pro', 'Enhanced learning experience', 29.99, '{"features": ["All basic features", "Premium content", "Private mentoring"]}'::jsonb),
        ('Enterprise', 'Full platform access', 99.99, '{"features": ["All pro features", "Custom branding", "API access"]}'::jsonb)
) AS p(plan_name, plan_description, price, features);

-- 3. Insert badges (needed for level configs)
INSERT INTO public.badges (id, community_id, name, description, points_value, category)
SELECT
    generate_uuid_v4(),
    c.id,
    b.badge_name,
    b.badge_description,
    b.points,
    b.category
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Early Adopter', 'Joined during the first month', 100, 'achievement'),
        ('Active Learner', 'Completed 5 courses', 200, 'learning'),
        ('Community Builder', 'Created 10 discussions', 300, 'engagement')
) AS b(badge_name, badge_description, points, category);

-- 4. Insert level configs
INSERT INTO public.level_configs (id, community_id, level, points_required, name, benefits)
SELECT
    generate_uuid_v4(),
    c.id,
    l.level_number,
    l.points_required,
    l.level_name,
    l.benefits
FROM public.communities c
CROSS JOIN (
    VALUES 
        (1, 0, 'Beginner', '{"benefits": ["Basic access", "Forum participation"]}'::jsonb),
        (2, 100, 'Intermediate', '{"benefits": ["Premium content access", "Event discounts"]}'::jsonb),
        (3, 500, 'Advanced', '{"benefits": ["Mentor status", "Custom badge"]}'::jsonb)
) AS l(level_number, points_required, level_name, benefits);

-- 5. Insert spaces (needed for content and discussions)
INSERT INTO public.spaces (id, community_id, name, description, type, visibility, config)
SELECT
    generate_uuid_v4(),
    c.id,
    s.space_name,
    s.space_description,
    s.space_type,
    'public',
    '{}'::jsonb
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('General Discussion', 'Main space for community discussions', 'forum'),
        ('Learning Resources', 'Educational content and materials', 'library'),
        ('Events & Workshops', 'Upcoming community events', 'events')
) AS s(space_name, space_description, space_type);

-- 6. Insert discussion topics
INSERT INTO public.discussion_topics (id, community_id, name, description, icon, space_id)
SELECT
    generate_uuid_v4(),
    c.id,
    t.topic_name,
    t.topic_description,
    t.icon,
    s.id as space_id
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Introductions', 'New member introductions', '👋'),
        ('Q&A', 'Questions and answers', '❓'),
        ('Share Your Work', 'Show what you''ve been working on', '🎨')
) AS t(topic_name, topic_description, icon)
CROSS JOIN public.spaces s
WHERE s.type = 'forum' AND s.community_id = c.id;

-- 7. Insert content categories
INSERT INTO public.content_categories (id, name, description, community_id)
SELECT
    generate_uuid_v4(),
    category_name,
    category_description,
    community_id
FROM (
    SELECT 
        c.id as community_id,
        unnest(ARRAY['Getting Started', 'Fundamentals', 'Advanced Topics']) as category_name,
        unnest(ARRAY[
            'Essential information for beginners',
            'Core concepts and principles',
            'In-depth technical content'
        ]) as category_description
    FROM public.communities c
) categories;

-- 8. Insert content items
INSERT INTO public.content_items (id, community_id, space_id, title, description, format, access_level, points_enabled, points_value, visibility, featured)
SELECT
    generate_uuid_v4(),
    c.id,
    s.id,
    i.title,
    i.description,
    i.format,
    i.access_level,
    true,
    i.points_value,
    'public',
    i.featured
FROM public.communities c
CROSS JOIN public.spaces s
CROSS JOIN (
    VALUES 
        ('Getting Started Guide', 'Learn the basics of our platform', 'document', 'free', 10, true),
        ('Advanced Techniques', 'Deep dive into advanced topics', 'video', 'premium', 50, false),
        ('Community Guidelines', 'Essential rules and practices', 'document', 'free', 5, true)
) AS i(title, description, format, access_level, points_value, featured)
WHERE s.type = 'library' AND s.community_id = c.id;

-- 9. Insert discussions
INSERT INTO public.discussions (id, community_id, topic_id, title, content, author_id)
SELECT
    generate_uuid_v4(),
    c.id,
    t.id,
    d.title,
    d.content,
    c.creator_id
FROM public.communities c
CROSS JOIN public.discussion_topics t
CROSS JOIN (
    VALUES 
        ('Welcome to the Community!', 'Introduce yourself and meet other members'),
        ('Tips & Tricks', 'Share your best practices and learn from others'),
        ('Help Needed', 'Got questions? Ask here!')
) AS d(title, content)
WHERE t.community_id = c.id;

-- 10. Insert rewards
INSERT INTO public.rewards (id, community_id, name, description, points_cost, is_active, quantity_available)
SELECT
    generate_uuid_v4(),
    c.id,
    r.reward_name,
    r.reward_description,
    r.points_cost,
    true,
    r.quantity
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('1-on-1 Mentoring', '30-minute private mentoring session', 500, 10),
        ('Premium Course', 'Access to any premium course', 1000, 50),
        ('Community Swag', 'T-shirt with community logo', 750, 100)
) AS r(reward_name, reward_description, points_cost, quantity);

-- 11. Insert community settings
INSERT INTO public.community_settings (id, community_id, settings_type, settings_data)
SELECT
    generate_uuid_v4(),
    c.id,
    s.setting_type,
    s.setting_data
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('general', '{"language": "en", "timezone": "UTC", "allow_guest_access": true}'::jsonb),
        ('notifications', '{"email_digest": true, "welcome_message": true}'::jsonb),
        ('gamification', '{"points_enabled": true, "badges_enabled": true}'::jsonb)
) AS s(setting_type, setting_data);

-- 12. Insert permissions
INSERT INTO public.permissions (id, community_id, role, resource, action, conditions)
SELECT
    generate_uuid_v4(),
    c.id,
    p.role_name,
    p.resource_name,
    p.action_name,
    p.conditions
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('admin', 'content_items', 'manage', '{}'::jsonb),
        ('moderator', 'discussions', 'moderate', '{"can_delete": true, "can_pin": true}'::jsonb),
        ('member', 'comments', 'create', '{"own_content_only": true}'::jsonb)
) AS p(role_name, resource_name, action_name, conditions);

-- 13. Insert payment gateways
INSERT INTO public.payment_gateways (id, community_id, gateway_type, is_active, config)
SELECT
    generate_uuid_v4(),
    c.id,
    'stripe',
    true,
    '{"test_mode": true, "webhook_secret": "whsec_test"}'::jsonb
FROM public.communities c;

-- 14. Insert sample members
INSERT INTO public.community_members (id, community_id, user_id, role, status)
SELECT
    generate_uuid_v4(),
    c.id,
    m.user_id,
    m.role,
    'active'
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('sample_member_1', 'member'),
        ('sample_member_2', 'member'),
        ('sample_moderator', 'moderator')
) AS m(user_id, role);

COMMIT; 