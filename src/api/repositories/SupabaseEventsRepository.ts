import { createClient } from '@/api/supabase';
import { Event, EventAttendee } from '@/types/events';
import { IEventsRepository } from '@/api/interfaces/IEventsRepository';

export interface EventFilters {
  isPremium?: boolean;
  isUpcoming?: boolean;
  timeframe?: 'today' | 'week' | 'month' | 'all';
  accessLevel?: 'free' | 'premium' | 'premium_plus';
}

export class SupabaseEventsRepository implements IEventsRepository {
  private supabase = createClient();
  private communityId: string;

  constructor(communityId: string = 'default') {
    this.communityId = communityId;
  }

  async getAll(): Promise<Event[]> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.communityId)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Transform data for compatibility with UI components
      return data.map(event => this.transformEventData(event));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Event> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('id', id.toString())
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Event with ID ${id} not found`);

      // Get attendees count
      const { count, error: countError } = await this.supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id.toString());

      if (countError) throw countError;

      const transformedEvent = this.transformEventData(data);
      transformedEvent.attendees = count || 0;

      return transformedEvent;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  }

  async create(event: Partial<Event>): Promise<Event> {
    try {
      const newEvent = {
        community_id: this.communityId,
        title: event.title,
        description: event.description || '',
        content: event.content || '',
        start_date: event.start_date || new Date().toISOString(),
        end_date: event.end_date || new Date().toISOString(),
        timezone: event.timezone,
        location_type: event.location_type || 'online',
        location_url: event.location_url,
        location_address: event.location_address,
        location_details: event.location_details,
        max_attendees: event.max_attendees,
        access_level: event.access_level || 'free',
        is_featured: event.is_featured || false,
        speaker_id: event.speaker_id,
        speaker_name: event.speaker_name,
        speaker_bio: event.speaker_bio,
        speaker_avatar: event.speaker_avatar,
        banner_url: event.banner_url,
        points_value: event.points_value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();

      if (error) throw error;

      return this.transformEventData(data);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async update(id: number, event: Partial<Event>): Promise<Event> {
    try {
      const updateData = {
        ...event,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('events')
        .update(updateData)
        .eq('id', id.toString())
        .select()
        .single();

      if (error) throw error;

      return this.transformEventData(data);
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('events')
        .delete()
        .eq('id', id.toString());

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw error;
    }
  }

  async registerAttendee(eventId: number, userId: string): Promise<void> {
    try {
      // Check if already registered
      const { data: existing, error: checkError } = await this.supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId.toString())
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        // Already registered
        return;
      }

      // Register for the event
      const { error } = await this.supabase
        .from('event_attendees')
        .insert({
          event_id: eventId.toString(),
          user_id: userId,
          status: 'registered',
          registration_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  async unregisterAttendee(eventId: number, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId.toString())
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  }

  async getAttendees(eventId: number): Promise<EventAttendee[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_attendees')
        .select(`
          *,
          profile:user_id (
            id,
            name,
            avatar_url,
            email
          )
        `)
        .eq('event_id', eventId.toString());

      if (error) throw error;

      return data.map(attendee => ({
        ...attendee,
        profile: attendee.profile || {
          id: attendee.user_id,
          name: 'Unknown User',
          avatar_url: null,
          email: null
        }
      }));
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      return [];
    }
  }

  async markAttendance(eventId: number, userId: string, attended: boolean): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .update({
          status: attended ? 'attended' : 'no_show',
          checkin_date: attended ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('event_id', eventId.toString())
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.communityId)
        .gt('start_date', now)
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data.map(event => this.transformEventData(event));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.communityId)
        .eq('is_featured', true)
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data.map(event => this.transformEventData(event));
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  }

  async getEventsByDate(startDate: Date, endDate: Date): Promise<Event[]> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.communityId)
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data.map(event => this.transformEventData(event));
    } catch (error) {
      console.error('Error fetching events by date:', error);
      return [];
    }
  }

  // Helper methods
  private transformEventData(event: any): Event {
    return {
      ...event,
      image: event.banner_url,
      url: event.location_url,
      time: this.formatEventTime(event.start_date, event.end_date, event.timezone),
      type: this.getEventType(event),
      location: event.location_address || event.location_details || 'Online',
      speaker: event.speaker_name ? {
        id: event.speaker_id || 'unknown',
        name: event.speaker_name,
        avatar: event.speaker_avatar,
        bio: event.speaker_bio
      } : undefined,
      status: this.getEventStatus(event),
      attendees: event.attendees || 0,
      capacity: event.max_attendees || 100,
      isRegistered: false, // Will be checked separately
      isPremium: event.access_level === 'premium' || event.access_level === 'premium_plus',
      pointsValue: event.points_value
    };
  }

  private formatEventTime(startDate: string, endDate: string, timezone?: string): string {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const startTime = start.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone || undefined
      });
      
      const endTime = end.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone || undefined
      });
      
      return `${startTime} - ${endTime}`;
    } catch (e) {
      console.error('Error formatting event time:', e);
      return 'Time not specified';
    }
  }

  private getEventType(event: any): string {
    // Determine event type based on properties
    if (event.location_type === 'online') {
      return 'webinar';
    }
    
    // Other logic to determine event type
    if (event.title.toLowerCase().includes('workshop')) return 'workshop';
    if (event.title.toLowerCase().includes('conference')) return 'conference';
    if (event.title.toLowerCase().includes('meetup')) return 'meetup';
    
    return 'event';
  }

  private getEventStatus(event: any): 'upcoming' | 'live' | 'past' | 'cancelled' {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (event.is_cancelled) return 'cancelled';
    if (now > endDate) return 'past';
    if (now >= startDate && now <= endDate) return 'live';
    return 'upcoming';
  }
}
