
import { createClient } from '@supabase/supabase-js';

export async function createSQLFunctions() {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  
  // Create function for content_items table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_content_items_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS content_items (
          id UUID PRIMARY KEY,
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
          file_size INTEGER
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for content categories table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_content_categories_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS content_categories (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          parent_id UUID REFERENCES content_categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for events table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_events_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for event_attendees table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_event_attendees_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS event_attendees (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES events(id),
          user_id TEXT NOT NULL,
          registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          attended BOOLEAN DEFAULT false,
          feedback TEXT,
          UNIQUE(event_id, user_id)
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for discussion_topics table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_discussion_topics_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS discussion_topics (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for discussions table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_discussions_table()
      RETURNS void AS $$
      BEGIN
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
          is_closed BOOLEAN DEFAULT false
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for discussion_replies table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_discussion_replies_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS discussion_replies (
          id UUID PRIMARY KEY,
          content TEXT NOT NULL,
          discussion_id UUID REFERENCES discussions(id),
          author_id TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_solution BOOLEAN DEFAULT false
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for user_points table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_user_points_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS user_points (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL UNIQUE,
          points INTEGER DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add function for add_points
        CREATE OR REPLACE FUNCTION add_points(user_id TEXT, points_to_add INTEGER)
        RETURNS INTEGER AS $$
        DECLARE
          current_points INTEGER;
        BEGIN
          INSERT INTO user_points (user_id, points)
          VALUES (user_id, points_to_add)
          ON CONFLICT (user_id) DO UPDATE
          SET points = user_points.points + points_to_add,
              last_updated = NOW()
          RETURNING points INTO current_points;
          
          RETURN current_points;
        END;
        $$ LANGUAGE plpgsql;
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for rewards table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_rewards_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS rewards (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          points_cost INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT true,
          quantity_available INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create function for redemptions table
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION create_redemptions_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS redemptions (
          id UUID PRIMARY KEY,
          user_id TEXT NOT NULL,
          reward_id UUID REFERENCES rewards(id),
          redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT DEFAULT 'pending',
          fulfillment_details JSONB
        );
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  // Create helper function to execute SQL
  await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION exec_sql(sql_string TEXT)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql_string;
      END;
      $$ LANGUAGE plpgsql;
    `
  });
}
