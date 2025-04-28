
import { createClient } from '@supabase/supabase-js';
import { IContentRepository } from '../interfaces/IContentRepository';
import { ContentItem } from '@/types/library';
import { BaseRepository } from './BaseRepository';

export class SupabaseContentRepository extends BaseRepository implements IContentRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getAll(): Promise<ContentItem[]> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .insert([content])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .update(content)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
}
