import { IMigrationRepository } from '../interfaces/IMigrationRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSQLFunctions } from '../migrations/createSQLFunctions';

export class SupabaseMigrationRepository implements IMigrationRepository {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async runMigrations(): Promise<boolean> {
    try {
      console.log("Starting migrations...");
      
      // Run SQL Function creation scripts
      await createSQLFunctions();
      
      // Create additional SQL functions
      await this.createAdditionalFunctions();
      
      // Create additional tables
      await this.createAdditionalTables();
      
      console.log("All migrations completed successfully.");
      return true;
    } catch (error) {
      console.error("Migration failed:", error);
      return false;
    }
  }
  
  private async createAdditionalFunctions(): Promise<void> {
    try {
      // Create increment/decrement functions for various counters
      await this.supabase.rpc('exec_sql', {
        sql_string: `
          CREATE OR REPLACE FUNCTION increment_content_views(content_id_param UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE content_items
            SET views = views + 1
            WHERE id = content_id_param;
          END;
          $$ LANGUAGE plpgsql;
          
          CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id_param UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE discussions
            SET view_count = view_count + 1
            WHERE id = discussion_id_param;
          END;
          $$ LANGUAGE plpgsql;
          
          CREATE OR REPLACE FUNCTION increment_post_comments(post_id_param UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE posts
            SET comment_count = comment_count + 1
            WHERE id = post_id_param;
          END;
          $$ LANGUAGE plpgsql;
          
          CREATE OR REPLACE FUNCTION decrement_post_comments(post_id_param UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE posts
            SET comment_count = GREATEST(comment_count - 1, 0)
            WHERE id = post_id_param;
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      console.log("Additional functions created successfully");
    } catch (e) {
      console.error("Error creating additional functions:", e);
      throw e;
    }
  }
  
  private async createAdditionalTables(): Promise<void> {
    try {
      // Create profiles table
      await this.supabase.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            name TEXT,
            email TEXT UNIQUE,
            avatar_url TEXT,
            bio TEXT,
            website TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      // Create points_transactions table
      await this.supabase.rpc('exec_sql', {
        sql_string: `
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
            FOREIGN KEY (community_id, user_id) REFERENCES user_points(community_id, user_id)
          );
          
          CREATE INDEX IF NOT EXISTS points_transactions_user_community_idx ON points_transactions(user_id, community_id);
        `
      });
      
      // Create content interactions table
      await this.supabase.rpc('exec_sql', {
        sql_string: `
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
        `
      });
      
      // Create post and related tables
      await this.supabase.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS posts (
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
          
          CREATE INDEX IF NOT EXISTS posts_community_id_idx ON posts(community_id);
          CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
          CREATE INDEX IF NOT EXISTS posts_space_id_idx ON posts(space_id);
          
          CREATE TABLE IF NOT EXISTS post_comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            author_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE
          );
          
          CREATE INDEX IF NOT EXISTS post_comments_post_id_idx ON post_comments(post_id);
          
          CREATE TABLE IF NOT EXISTS post_reactions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            reaction_type TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(post_id, user_id)
          );
          
          CREATE INDEX IF NOT EXISTS post_reactions_post_id_idx ON post_reactions(post_id);
        `
      });
      
      console.log("Additional tables created successfully");
    } catch (e) {
      console.error("Error creating additional tables:", e);
      throw e;
    }
  }
}
