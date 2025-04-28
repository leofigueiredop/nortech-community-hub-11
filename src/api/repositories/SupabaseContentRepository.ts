
import { IContentRepository } from '../interfaces/IContentRepository';
import { BaseRepository } from './BaseRepository';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../ApiClient';
import { ContentItem } from '@/types/library';

export class SupabaseContentRepository extends BaseRepository implements IContentRepository {
  constructor() {
    super();
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  async getAll(): Promise<ContentItem[]> {
    try {
      await this.setTenantContext();
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
      await this.setTenantContext();
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
      await this.setTenantContext();
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
      await this.setTenantContext();
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
      await this.setTenantContext();
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
