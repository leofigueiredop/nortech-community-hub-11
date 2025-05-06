import { supabase } from '@/lib/supabase';

export async function createSQLFunctions() {
  // First, create the helper function to execute SQL
  try {
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
  } catch (e) {
    console.log("Creating exec_sql function (may already exist):", e);
    // Continue execution even if this fails
  }
  
  // Create communities table (tenant table)
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
          api_keys JSONB
        );
      `
    });
    console.log("Created communities table successfully");
  } catch (e) {
    console.error("Error creating communities table:", e);
  }
  
  // Create community_settings table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS community_settings (
          id UUID PRIMARY KEY,
          community_id UUID NOT NULL REFERENCES communities(id),
          settings_type TEXT NOT NULL,
          settings_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(community_id, settings_type)
        );
      `
    });
    console.log("Created community_settings table successfully");
  } catch (e) {
    console.error("Error creating community_settings table:", e);
  }
  
  // Create community_members table (for user roles & permissions)
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
          UNIQUE(community_id, user_id)
        );
        
        CREATE INDEX IF NOT EXISTS community_members_community_id_idx ON community_members(community_id);
        CREATE INDEX IF NOT EXISTS community_members_user_id_idx ON community_members(user_id);
      `
    });
    console.log("Created community_members table successfully");
  } catch (e) {
    console.error("Error creating community_members table:", e);
  }

  // Create subscription_plans table (pricing plans)
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created subscription_plans table successfully");
  } catch (e) {
    console.error("Error creating subscription_plans table:", e);
  }

  // Create spaces table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created spaces table successfully");
  } catch (e) {
    console.error("Error creating spaces table:", e);
  }

  // Create payment_gateways table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created payment_gateways table successfully");
  } catch (e) {
    console.error("Error creating payment_gateways table:", e);
  }

  // Create permissions table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created permissions table successfully");
  } catch (e) {
    console.error("Error creating permissions table:", e);
  }
  
  // Update content_items table to include community_id column
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
          space_id UUID REFERENCES spaces(id)
        );
        
        CREATE INDEX IF NOT EXISTS content_items_community_id_idx ON content_items(community_id);
        CREATE INDEX IF NOT EXISTS content_items_space_id_idx ON content_items(space_id);
      `
    });
    console.log("Created content_items table successfully");
  } catch (e) {
    console.error("Error creating content_items table:", e);
  }
  
  // Create content_categories table with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS content_categories (
          id UUID PRIMARY KEY,
          community_id UUID NOT NULL REFERENCES communities(id),
          name TEXT NOT NULL,
          description TEXT,
          parent_id UUID REFERENCES content_categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          sort_order INTEGER DEFAULT 0
        );
        
        CREATE INDEX IF NOT EXISTS content_categories_community_id_idx ON content_categories(community_id);
      `
    });
    console.log("Created content_categories table successfully");
  } catch (e) {
    console.error("Error creating content_categories table:", e);
  }
  
  // Create events table with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS events (
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
          space_id UUID REFERENCES spaces(id)
        );
        
        CREATE INDEX IF NOT EXISTS events_community_id_idx ON events(community_id);
        CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
      `
    });
    console.log("Created events table successfully");
  } catch (e) {
    console.error("Error creating events table:", e);
  }
  
  // Create event_attendees table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS event_attendees (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES events(id),
          user_id TEXT NOT NULL,
          registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          attended BOOLEAN DEFAULT false,
          feedback TEXT,
          UNIQUE(event_id, user_id)
        );
        
        CREATE INDEX IF NOT EXISTS event_attendees_event_id_idx ON event_attendees(event_id);
        CREATE INDEX IF NOT EXISTS event_attendees_user_id_idx ON event_attendees(user_id);
      `
    });
    console.log("Created event_attendees table successfully");
  } catch (e) {
    console.error("Error creating event_attendees table:", e);
  }
  
  // Create discussion_topics table with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS discussion_topics (
          id UUID PRIMARY KEY,
          community_id UUID NOT NULL REFERENCES communities(id),
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          space_id UUID REFERENCES spaces(id)
        );
        
        CREATE INDEX IF NOT EXISTS discussion_topics_community_id_idx ON discussion_topics(community_id);
      `
    });
    console.log("Created discussion_topics table successfully");
  } catch (e) {
    console.error("Error creating discussion_topics table:", e);
  }
  
  // Create discussions table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
          community_id UUID NOT NULL REFERENCES communities(id)
        );
        
        CREATE INDEX IF NOT EXISTS discussions_topic_id_idx ON discussions(topic_id);
        CREATE INDEX IF NOT EXISTS discussions_community_id_idx ON discussions(community_id);
        CREATE INDEX IF NOT EXISTS discussions_author_id_idx ON discussions(author_id);
      `
    });
    console.log("Created discussions table successfully");
  } catch (e) {
    console.error("Error creating discussions table:", e);
  }
  
  // Create discussion_replies table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS discussion_replies (
          id UUID PRIMARY KEY,
          content TEXT NOT NULL,
          discussion_id UUID REFERENCES discussions(id),
          author_id TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_solution BOOLEAN DEFAULT false
        );
        
        CREATE INDEX IF NOT EXISTS discussion_replies_discussion_id_idx ON discussion_replies(discussion_id);
      `
    });
    console.log("Created discussion_replies table successfully");
  } catch (e) {
    console.error("Error creating discussion_replies table:", e);
  }
  
  // Create user_points table with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS user_points (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          community_id UUID NOT NULL REFERENCES communities(id),
          points INTEGER DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, community_id)
        );
        
        CREATE INDEX IF NOT EXISTS user_points_user_community_idx ON user_points(user_id, community_id);
      `
    });
    console.log("Created user_points table successfully");
  } catch (e) {
    console.error("Error creating user_points table:", e);
  }
  
  // Add updated add_points function with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created add_points function successfully");
  } catch (e) {
    console.error("Error creating add_points function:", e);
  }
  
  // Create rewards table with community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
          expires_at TIMESTAMP WITH TIME ZONE
        );
        
        CREATE INDEX IF NOT EXISTS rewards_community_id_idx ON rewards(community_id);
      `
    });
    console.log("Created rewards table successfully");
  } catch (e) {
    console.error("Error creating rewards table:", e);
  }
  
  // Create redemptions table
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS redemptions (
          id UUID PRIMARY KEY,
          user_id TEXT NOT NULL,
          reward_id UUID REFERENCES rewards(id),
          redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT DEFAULT 'pending',
          fulfillment_details JSONB,
          community_id UUID NOT NULL REFERENCES communities(id)
        );
        
        CREATE INDEX IF NOT EXISTS redemptions_user_id_idx ON redemptions(user_id);
        CREATE INDEX IF NOT EXISTS redemptions_community_id_idx ON redemptions(community_id);
      `
    });
    console.log("Created redemptions table successfully");
  } catch (e) {
    console.error("Error creating redemptions table:", e);
  }
  
  // Create tenant context function to filter by community_id
  try {
    await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    console.log("Created tenant context functions successfully");
  } catch (e) {
    console.error("Error creating tenant context functions:", e);
  }
}
