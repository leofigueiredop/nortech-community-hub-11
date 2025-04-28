
import { createClient } from '@supabase/supabase-js';
import { IMigrationRepository } from '../interfaces/IMigrationRepository';
import { BaseRepository } from './BaseRepository';

export class SupabaseMigrationRepository extends BaseRepository implements IMigrationRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async createContentTables(): Promise<void> {
    try {
      // Create content_items table
      const { error: contentError } = await this.supabase.rpc('create_content_items_table');
      if (contentError) throw contentError;
      
      // Create content categories table
      const { error: categoriesError } = await this.supabase.rpc('create_content_categories_table');
      if (categoriesError) throw categoriesError;
      
      console.log('Content tables created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createEventsTables(): Promise<void> {
    try {
      // Create events table
      const { error: eventsError } = await this.supabase.rpc('create_events_table');
      if (eventsError) throw eventsError;
      
      // Create event_attendees table
      const { error: attendeesError } = await this.supabase.rpc('create_event_attendees_table');
      if (attendeesError) throw attendeesError;
      
      console.log('Events tables created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDiscussionTables(): Promise<void> {
    try {
      // Create discussion_topics table
      const { error: topicsError } = await this.supabase.rpc('create_discussion_topics_table');
      if (topicsError) throw topicsError;
      
      // Create discussions table
      const { error: discussionsError } = await this.supabase.rpc('create_discussions_table');
      if (discussionsError) throw discussionsError;
      
      // Create discussion_replies table
      const { error: repliesError } = await this.supabase.rpc('create_discussion_replies_table');
      if (repliesError) throw repliesError;
      
      console.log('Discussion tables created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createPointsTables(): Promise<void> {
    try {
      // Create user_points table
      const { error: pointsError } = await this.supabase.rpc('create_user_points_table');
      if (pointsError) throw pointsError;
      
      // Create rewards table
      const { error: rewardsError } = await this.supabase.rpc('create_rewards_table');
      if (rewardsError) throw rewardsError;
      
      // Create redemptions table
      const { error: redemptionsError } = await this.supabase.rpc('create_redemptions_table');
      if (redemptionsError) throw redemptionsError;
      
      console.log('Points tables created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMigrationStatus(): Promise<{
    content: boolean;
    events: boolean;
    discussions: boolean;
    points: boolean;
  }> {
    try {
      // Check if tables exist
      const { data: tables, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      const tableNames = tables.map(t => t.table_name);
      
      return {
        content: tableNames.includes('content_items'),
        events: tableNames.includes('events'),
        discussions: tableNames.includes('discussion_topics'),
        points: tableNames.includes('user_points'),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
