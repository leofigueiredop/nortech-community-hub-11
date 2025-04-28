
import { createClient } from '@supabase/supabase-js';
import { IEventsRepository } from '../interfaces/IEventsRepository';
import { Event, EventAttendee } from '@/components/events/types/EventTypes';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../ApiClient';

export class SupabaseEventsRepository extends BaseRepository implements IEventsRepository {
  constructor() {
    super();
  }

  async getAll(): Promise<Event[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
      return data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: number): Promise<Event> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        date: new Date(data.date)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(event: Partial<Event>): Promise<Event> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .insert([{
          ...event,
          community_id: this.currentCommunityId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        date: new Date(data.date)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, event: Partial<Event>): Promise<Event> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        date: new Date(data.date)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async registerAttendee(eventId: number, userId: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('event_attendees')
        .insert([{ 
          event_id: eventId, 
          user_id: userId 
        }]);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async unregisterAttendee(eventId: number, userId: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAttendees(eventId: number): Promise<EventAttendee[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('event_attendees')
        .select('*, profile:profiles(*)')
        .eq('event_id', eventId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async markAttendance(eventId: number, userId: string, attended: boolean): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('event_attendees')
        .update({ attended })
        .eq('event_id', eventId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    try {
      await this.setTenantContext();
      const now = new Date().toISOString();
      
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .gte('date', now)
        .order('date', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .eq('is_featured', true)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getEventsByDate(startDate: Date, endDate: Date): Promise<Event[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
