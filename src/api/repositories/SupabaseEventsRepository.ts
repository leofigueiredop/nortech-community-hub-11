import { SupabaseClient } from '@supabase/supabase-js';
import { Event, EventAttendee } from '@/types/events';
import { IEventsRepository, EventFilters } from '@/api/interfaces/IEventsRepository';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';

export class SupabaseEventsRepository implements IEventsRepository {
  private communityId: string | null = null;
  
  constructor(private supabase: SupabaseClient) {}

  setCommunityContext(communityId: string) {
    this.communityId = communityId;
  }

  private ensureCommunityContext(): AppError | null {
    if (!this.communityId) {
      return {
        message: 'Community context not set',
        code: 'COMMUNITY_CONTEXT_MISSING'
      };
    }
    return null;
  }

  private transformEventData(data: any): Event {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      image_url: data.image_url,
      event_type: data.event_type,
      capacity: data.capacity,
      is_virtual: data.is_virtual,
      meeting_link: data.meeting_link,
      organizer_id: data.organizer_id,
      is_featured: data.is_featured,
      points_awarded: data.points_awarded,
      space_id: data.space_id,
      start_date: data.start_date,
      end_date: data.end_date,
      timezone: data.timezone,
      location_type: data.location_type,
      location_url: data.location_url,
      location_address: data.location_address,
      location_details: data.location_details,
      max_attendees: data.max_attendees,
      access_level: data.access_level,
      speaker_id: data.speaker_id,
      speaker_name: data.speaker_name,
      speaker_bio: data.speaker_bio,
      speaker_avatar: data.speaker_avatar,
      banner_url: data.banner_url,
      points_value: data.points_value,
      created_at: data.created_at,
      updated_at: data.updated_at,
      community_id: data.community_id,
      url: data.url,
      time: data.time,
      type: data.type,
      speaker: data.speaker,
      status: data.status,
      attendees: data.attendees,
      isRegistered: data.isRegistered,
      isPremium: data.isPremium,
      pointsValue: data.pointsValue,
      registeredUsers: data.registeredUsers,
      platform: data.platform
    };
  }

  async getUpcomingEvents(param?: number | EventFilters): Promise<Result<Event[], AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      let query = this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.communityId)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (typeof param === 'number') {
        query = query.limit(param);
      } else if (param) {
        if (param.isPremium !== undefined) {
          query = query.eq('is_premium', param.isPremium);
        }
        if (param.accessLevel) {
          query = query.eq('access_level', param.accessLevel);
        }
        if (param.timeframe) {
          const now = new Date();
          let endDate = new Date();
          
          switch (param.timeframe) {
            case 'today':
              endDate.setHours(23, 59, 59);
              break;
            case 'week':
              endDate.setDate(now.getDate() + 7);
              break;
            case 'month':
              endDate.setMonth(now.getMonth() + 1);
              break;
          }

          if (param.timeframe !== 'all') {
            query = query.lte('start_date', endDate.toISOString());
          }
        }
      }

      const { data, error } = await query;

      if (error) {
        return {
          error: {
            message: 'Failed to fetch upcoming events',
            code: 'FETCH_EVENTS_ERROR',
            cause: error
          }
        };
      }

      return { data: data.map(this.transformEventData) };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while fetching events',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async getAll(): Promise<Result<Event[], AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          error: {
            message: 'Failed to fetch events',
            code: 'FETCH_EVENTS_ERROR',
            cause: error
          }
        };
      }

      return { data };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while fetching events',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async getById(id: number): Promise<Result<Event, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.communityId)
        .single();

      if (error) {
        return {
          error: {
            message: 'Failed to fetch event',
            code: 'FETCH_EVENT_ERROR',
            cause: error
          }
        };
      }

      return { data: this.transformEventData(data) };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while fetching the event',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async create(event: Partial<Event>): Promise<Result<Event, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { data, error } = await this.supabase
        .from('events')
        .insert([{ ...event, community_id: this.communityId }])
        .select()
        .single();

      if (error) {
        return {
          error: {
            message: 'Failed to create event',
            code: 'CREATE_EVENT_ERROR',
            cause: error
          }
        };
      }

      return { data: this.transformEventData(data) };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while creating the event',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async update(id: number, event: Partial<Event>): Promise<Result<Event, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { data, error } = await this.supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .eq('community_id', this.communityId)
        .select()
        .single();

      if (error) {
        return {
          error: {
            message: 'Failed to update event',
            code: 'UPDATE_EVENT_ERROR',
            cause: error
          }
        };
      }

      return { data: this.transformEventData(data) };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while updating the event',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async delete(id: number): Promise<Result<void, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { error } = await this.supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('community_id', this.communityId);

      if (error) {
        return {
          error: {
            message: 'Failed to delete event',
            code: 'DELETE_EVENT_ERROR',
            cause: error
          }
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while deleting the event',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async registerAttendee(eventId: number, userId: string): Promise<Result<void, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .insert([{ event_id: eventId, user_id: userId }]);

      if (error) {
        return {
          error: {
            message: 'Failed to register attendee',
            code: 'REGISTER_ATTENDEE_ERROR',
            cause: error
          }
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while registering the attendee',
          code: 'UNEXPECTED_ERROR',
          cause: error
        }
      };
    }
  }

  async unregisterAttendee(eventId: number, userId: string): Promise<Result<void, AppError>> {
    const contextError = this.ensureCommunityContext();
    if (contextError) {
      return { error: contextError };
    }

    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: 'Failed to unregister attendee' } };
    }
  }

  async getAttendees(eventId: number): Promise<Result<EventAttendee[], AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('event_attendees')
        .select('*, users(*)')
        .eq('event_id', eventId);

      if (error) {
        return { error: { message: error.message } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to fetch attendees' } };
    }
  }

  async markAttendance(eventId: number, userId: string, attended: boolean): Promise<Result<void, AppError>> {
    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .update({ attended })
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: 'Failed to mark attendance' } };
    }
  }

  async getFeaturedEvents(): Promise<Result<Event[], AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('start_date', { ascending: true });

      if (error) {
        return { error: { message: error.message } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to fetch featured events' } };
    }
  }

  async getEventsByDate(startDate: Date, endDate: Date): Promise<Result<Event[], AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .order('start_date', { ascending: true });

      if (error) {
        return { error: { message: error.message } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to fetch events by date' } };
    }
  }

  async checkInAttendee(eventId: number, userId: string): Promise<Result<boolean, AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('event_attendees')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { error: { message: error.message } };
      }

      return { data: true };
    } catch (error) {
      return { error: { message: 'Failed to check in attendee' } };
    }
  }

  async getEventAttendees(eventId: number): Promise<Result<EventAttendee[], AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('event_attendees')
        .select('*, users(*)')
        .eq('event_id', eventId);

      if (error) {
        return { error: { message: error.message } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to fetch event attendees' } };
    }
  }

  async searchAttendees(eventId: number, query: string): Promise<Result<EventAttendee[], AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('event_attendees')
        .select('*, users(*)')
        .eq('event_id', eventId)
        .textSearch('users.name', query);

      if (error) {
        return { error: { message: error.message } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to search attendees' } };
    }
  }

  async scheduleEventReminder(eventId: number, userId: string): Promise<Result<boolean, AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('event_reminders')
        .insert([{ event_id: eventId, user_id: userId }])
        .select()
        .single();

      if (error) {
        return { error: { message: error.message } };
      }

      return { data: true };
    } catch (error) {
      return { error: { message: 'Failed to schedule event reminder' } };
    }
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
