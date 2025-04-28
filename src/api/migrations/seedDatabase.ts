
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config';

export async function seedDatabase() {
  const supabase = createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
  );

  try {
    // Seed communities
    const { data: community } = await supabase
      .from('communities')
      .insert([{
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Nortech',
        description: 'A technology learning community',
        logo_url: 'https://via.placeholder.com/150',
        banner_url: 'https://via.placeholder.com/1200x300',
        creator_id: 'system',
        status: 'active'
      }])
      .select()
      .single();

    // Seed content items
    await supabase.from('content_items').insert([
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        community_id: community.id,
        title: 'Introduction to React',
        description: 'Learn the basics of React development',
        format: 'video',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'John Doe',
        duration: 3600,
        access_level: 'free',
        tags: ['react', 'javascript', 'frontend'],
        views: 0
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        community_id: community.id,
        title: 'Advanced TypeScript',
        description: 'Master TypeScript development',
        format: 'course',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'Jane Smith',
        duration: 7200,
        access_level: 'premium',
        tags: ['typescript', 'javascript', 'programming'],
        views: 0
      }
    ]);

    // Seed events
    await supabase.from('events').insert([
      {
        community_id: community.id,
        title: 'React Workshop',
        description: 'Hands-on React development workshop',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Online',
        event_type: 'workshop',
        is_virtual: true,
        capacity: 50,
        organizer_id: 'system',
        points_awarded: 100
      },
      {
        community_id: community.id,
        title: 'TypeScript Meetup',
        description: 'Monthly TypeScript community meetup',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Tech Hub',
        event_type: 'meetup',
        is_virtual: false,
        capacity: 30,
        organizer_id: 'system',
        points_awarded: 50
      }
    ]);

    // Seed discussion topics
    await supabase.from('discussion_topics').insert([
      {
        id: '123e4567-e89b-12d3-a456-426614174003',
        community_id: community.id,
        name: 'General Discussion',
        description: 'General community discussions',
        icon: 'MessageSquare'
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174004',
        community_id: community.id,
        name: 'Technical Questions',
        description: 'Get help with technical problems',
        icon: 'HelpCircle'
      }
    ]);

    // Seed discussions
    await supabase.from('discussions').insert([
      {
        id: '123e4567-e89b-12d3-a456-426614174005',
        title: 'Welcome to our community!',
        content: 'Introduce yourself and meet other members',
        topic_id: '123e4567-e89b-12d3-a456-426614174003',
        author_id: 'system',
        community_id: community.id,
        is_pinned: true
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174006',
        title: 'React vs Vue - Pros and Cons',
        content: 'Let\'s discuss the differences between React and Vue',
        topic_id: '123e4567-e89b-12d3-a456-426614174004',
        author_id: 'system',
        community_id: community.id,
        is_pinned: false
      }
    ]);

    // Seed rewards
    await supabase.from('rewards').insert([
      {
        id: '123e4567-e89b-12d3-a456-426614174007',
        community_id: community.id,
        name: 'Premium Monthly Access',
        description: '1 month of premium content access',
        points_cost: 1000,
        is_active: true,
        quantity_available: 100
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174008',
        community_id: community.id,
        name: 'Private Mentoring Session',
        description: '1-hour private mentoring session',
        points_cost: 2000,
        is_active: true,
        quantity_available: 10
      }
    ]);

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
