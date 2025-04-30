-- Seed script for initial data

-- Helper function to generate UUID v4
CREATE OR REPLACE FUNCTION generate_uuid_v4()
RETURNS uuid AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

BEGIN;

-- Insert sample communities
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
) AS v(name, description, domain, creator_id, theme_config)
WHERE NOT EXISTS (
    SELECT 1 FROM public.communities c WHERE c.domain = v.domain
);

-- Insert sample content categories
INSERT INTO public.content_categories (id, name, description, community_id)
SELECT DISTINCT ON (community_id, category_name)
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
) categories
WHERE NOT EXISTS (
    SELECT 1 FROM public.content_categories cc 
    WHERE cc.community_id = categories.community_id AND cc.name = categories.category_name
);

-- Insert sample spaces
INSERT INTO public.spaces (id, community_id, name, description, type, visibility, config)
SELECT DISTINCT ON (c.id, s.space_name)
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
) AS s(space_name, space_description, space_type)
WHERE NOT EXISTS (
    SELECT 1 FROM public.spaces sp 
    WHERE sp.community_id = c.id AND sp.name = s.space_name
);

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (id, community_id, name, description, price, interval, features, is_active)
SELECT DISTINCT ON (c.id, p.plan_name)
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
) AS p(plan_name, plan_description, price, features)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subscription_plans sp 
    WHERE sp.community_id = c.id AND sp.name = p.plan_name
);

-- Insert sample badges
INSERT INTO public.badges (id, community_id, name, description, points_value, category)
SELECT DISTINCT ON (c.id, b.badge_name)
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
) AS b(badge_name, badge_description, points, category)
WHERE NOT EXISTS (
    SELECT 1 FROM public.badges bg 
    WHERE bg.community_id = c.id AND bg.name = b.badge_name
);

-- Insert sample level configs
INSERT INTO public.level_configs (id, community_id, level, points_required, name, benefits)
SELECT DISTINCT ON (c.id, l.level_number)
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
) AS l(level_number, points_required, level_name, benefits)
WHERE NOT EXISTS (
    SELECT 1 FROM public.level_configs lc 
    WHERE lc.community_id = c.id AND lc.level = l.level_number
);

-- Insert sample rewards
INSERT INTO public.rewards (id, community_id, name, description, points_cost, is_active, quantity_available)
SELECT DISTINCT ON (c.id, r.reward_name)
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
        ('1-on-1 Mentoring Session', '30-minute private mentoring', 500, 10),
        ('Premium Course Access', 'Access to any premium course', 1000, 50),
        ('Community Swag', 'T-shirt with community logo', 750, 100)
) AS r(reward_name, reward_description, points_cost, quantity)
WHERE NOT EXISTS (
    SELECT 1 FROM public.rewards rw 
    WHERE rw.community_id = c.id AND rw.name = r.reward_name
);

-- Insert sample discussion topics
INSERT INTO public.discussion_topics (id, community_id, name, description, icon)
SELECT DISTINCT ON (c.id, t.topic_name)
    generate_uuid_v4(),
    c.id,
    t.topic_name,
    t.topic_description,
    t.icon
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Introductions', 'New member introductions', '👋'),
        ('Q&A', 'Questions and answers', '❓'),
        ('Share Your Work', 'Show what you''ve been working on', '🎨')
) AS t(topic_name, topic_description, icon)
WHERE NOT EXISTS (
    SELECT 1 FROM public.discussion_topics dt 
    WHERE dt.community_id = c.id AND dt.name = t.topic_name
);

-- Insert sample payment gateways
INSERT INTO public.payment_gateways (id, community_id, gateway_type, is_active, config)
SELECT DISTINCT ON (c.id, 'stripe')
    generate_uuid_v4(),
    c.id,
    'stripe',
    true,
    '{"test_mode": true, "webhook_secret": "whsec_test"}'::jsonb
FROM public.communities c
WHERE NOT EXISTS (
    SELECT 1 FROM public.payment_gateways pg 
    WHERE pg.community_id = c.id AND pg.gateway_type = 'stripe'
);

-- Insert sample permissions
INSERT INTO public.permissions (id, community_id, role, resource, action, conditions)
SELECT DISTINCT ON (c.id, p.role_name, p.resource_name, p.action_name)
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
) AS p(role_name, resource_name, action_name, conditions)
WHERE NOT EXISTS (
    SELECT 1 FROM public.permissions pm 
    WHERE pm.community_id = c.id 
    AND pm.role = p.role_name 
    AND pm.resource = p.resource_name 
    AND pm.action = p.action_name
);

-- Insert sample community settings
INSERT INTO public.community_settings (id, community_id, settings_type, settings_data)
SELECT DISTINCT ON (c.id, s.setting_type)
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
) AS s(setting_type, setting_data)
WHERE NOT EXISTS (
    SELECT 1 FROM public.community_settings cs 
    WHERE cs.community_id = c.id AND cs.settings_type = s.setting_type
);

COMMIT; 