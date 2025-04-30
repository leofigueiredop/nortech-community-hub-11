-- Seed script for content-related data
BEGIN;

-- Insert sample content items
INSERT INTO public.content_items (id, community_id, title, description, format, access_level, points_enabled, points_value, visibility, featured)
SELECT DISTINCT ON (c.id, content_title)
    generate_uuid_v4(),
    c.id,
    content_title,
    content_description,
    content_format,
    access_level,
    true,
    points_value,
    'public',
    featured
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Getting Started with Our Platform', 'Learn the basics of our community platform', 'video', 'free', 10, true),
        ('Advanced Techniques Workshop', 'Deep dive into advanced topics', 'course', 'premium', 50, false),
        ('Community Best Practices', 'Guidelines for effective participation', 'document', 'free', 15, true),
        ('Expert Interview Series', 'Interviews with industry experts', 'video', 'premium', 30, true),
        ('Hands-on Project Tutorial', 'Step-by-step project guide', 'course', 'free', 25, false)
) AS content(content_title, content_description, content_format, access_level, points_value, featured)
WHERE NOT EXISTS (
    SELECT 1 FROM public.content_items ci 
    WHERE ci.community_id = c.id AND ci.title = content_title
);

-- Insert sample discussions
INSERT INTO public.discussions (id, community_id, title, content, author_id, is_pinned, view_count)
SELECT DISTINCT ON (c.id, discussion_title)
    generate_uuid_v4(),
    c.id,
    discussion_title,
    discussion_content,
    'sample_user_1',
    is_pinned,
    floor(random() * 100)::int
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Welcome to our Community!', 'Introduce yourself and meet other members', true),
        ('Weekly Discussion Thread', 'Share your thoughts and experiences', true),
        ('Tips & Tricks Collection', 'Share your best practices and tips', false),
        ('Q&A Session: Ask Anything', 'Open discussion for all questions', false)
) AS discussions(discussion_title, discussion_content, is_pinned)
WHERE NOT EXISTS (
    SELECT 1 FROM public.discussions d 
    WHERE d.community_id = c.id AND d.title = discussion_title
);

-- Insert sample discussion replies
INSERT INTO public.discussion_replies (id, discussion_id, content, author_id)
SELECT DISTINCT ON (d.id, r.reply_content, r.author_id)
    generate_uuid_v4(),
    d.id,
    r.reply_content,
    r.author_id
FROM public.discussions d
CROSS JOIN (
    VALUES 
        ('Great discussion! Thanks for sharing.', 'sample_user_2'),
        ('I completely agree with this point.', 'sample_user_3'),
        ('Here''s my perspective on this topic...', 'sample_user_4')
) AS r(reply_content, author_id)
WHERE NOT EXISTS (
    SELECT 1 FROM public.discussion_replies dr 
    WHERE dr.discussion_id = d.id AND dr.content = r.reply_content AND dr.author_id = r.author_id
);

-- Insert sample events
INSERT INTO public.events (id, community_id, title, description, date, event_type, capacity, is_virtual, points_awarded)
SELECT DISTINCT ON (c.id, event_title)
    nextval('public.events_id_seq'),
    c.id,
    event_title,
    event_description,
    event_date,
    event_type,
    capacity,
    is_virtual,
    points
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Welcome Webinar', 'Introduction to our community', now() + interval '7 days', 'webinar', 100, true, 20),
        ('Monthly Meetup', 'Regular community gathering', now() + interval '14 days', 'meetup', 50, false, 30),
        ('Expert Workshop', 'Hands-on learning session', now() + interval '21 days', 'workshop', 30, true, 40)
) AS events(event_title, event_description, event_date, event_type, capacity, is_virtual, points)
WHERE NOT EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.community_id = c.id AND e.title = event_title
);

-- Insert sample posts
INSERT INTO public.posts (id, community_id, author_id, content, visibility)
SELECT DISTINCT ON (c.id, post_content)
    generate_uuid_v4(),
    c.id,
    'sample_user_1',
    post_content,
    'public'
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('Excited to announce our new learning resources!'),
        ('Check out the upcoming events this month'),
        ('Congratulations to our top contributors!')
) AS posts(post_content)
WHERE NOT EXISTS (
    SELECT 1 FROM public.posts p 
    WHERE p.community_id = c.id AND p.content = post_content
);

-- Insert sample post comments
INSERT INTO public.post_comments (id, post_id, author_id, content)
SELECT DISTINCT ON (p.id, c.author_id, c.comment_content)
    generate_uuid_v4(),
    p.id,
    c.author_id,
    c.comment_content
FROM public.posts p
CROSS JOIN (
    VALUES 
        ('sample_user_2', 'This is amazing news!'),
        ('sample_user_3', 'Looking forward to participating'),
        ('sample_user_4', 'Great initiative!')
) AS c(author_id, comment_content)
WHERE NOT EXISTS (
    SELECT 1 FROM public.post_comments pc 
    WHERE pc.post_id = p.id AND pc.author_id = c.author_id AND pc.content = c.comment_content
);

-- Insert sample post reactions
INSERT INTO public.post_reactions (id, post_id, user_id, reaction_type)
SELECT DISTINCT ON (p.id, r.user_id, r.reaction_type)
    generate_uuid_v4(),
    p.id,
    r.user_id,
    r.reaction_type
FROM public.posts p
CROSS JOIN (
    VALUES 
        ('sample_user_2', 'like'),
        ('sample_user_3', 'celebrate'),
        ('sample_user_4', 'like')
) AS r(user_id, reaction_type)
WHERE NOT EXISTS (
    SELECT 1 FROM public.post_reactions pr 
    WHERE pr.post_id = p.id AND pr.user_id = r.user_id AND pr.reaction_type = r.reaction_type
);

-- Insert sample analytics events
INSERT INTO public.analytics_events (id, community_id, event_type, user_id, metadata)
SELECT DISTINCT ON (c.id, e.event_type, e.user_id, e.metadata::text)
    generate_uuid_v4(),
    c.id,
    e.event_type,
    e.user_id,
    e.metadata
FROM public.communities c
CROSS JOIN (
    VALUES 
        ('page_view', 'sample_user_1', '{"page": "home", "duration": 300}'::jsonb),
        ('content_complete', 'sample_user_2', '{"content_id": "123", "duration": 1500}'::jsonb),
        ('event_register', 'sample_user_3', '{"event_id": "456", "ticket_type": "free"}'::jsonb)
) AS e(event_type, user_id, metadata)
WHERE NOT EXISTS (
    SELECT 1 FROM public.analytics_events ae 
    WHERE ae.community_id = c.id AND ae.event_type = e.event_type 
    AND ae.user_id = e.user_id AND ae.metadata::text = e.metadata::text
);

COMMIT; 