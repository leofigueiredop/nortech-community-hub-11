import { createClient } from '@supabase/supabase-js';
import { IEventsRepository } from '../interfaces/IEventsRepository';
import { Event } from '@/components/events/types/EventTypes';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../ApiClient';

export class SupabaseEventsRepository extends BaseRepository implements IEventsRepository {
  constructor() {
    super();
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  async getAll(): Promise<Event[]> {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*');
      
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
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('id', id)
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
      const { data, error } = await this.supabase
        .from('events')
        .insert([event])
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
      const { data, error } = await this.supabase
        .from('events')
        .update(event)
        .eq('id', id)
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
      const { error } = await this.supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async registerAttendee(eventId: number, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('event_attendees')
        .insert([{ event_id: eventId, user_id: userId }]);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
}
