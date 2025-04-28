import { IContentRepository } from '../interfaces/IContentRepository';
import { BaseRepository } from './BaseRepository';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../ApiClient';

export class SupabaseContentRepository extends BaseRepository implements IContentRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  async getContents() {
    await this.setTenantContext();
    const { data, error } = await this.supabase
      .from('content_items')
      .select('*');
    
    return this.handleResponse(data);
  }

  async getContent(id: string) {
    await this.setTenantContext();
    const { data, error } = await this.supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();
    
    return this.handleResponse(data);
  }

  async createContent(content: any) {
    await this.setTenantContext();
    const { data, error } = await this.supabase
      .from('content_items')
      .insert([content])
      .select()
      .single();
    
    return this.handleResponse(data);
  }

  async updateContent(id: string, content: any) {
    await this.setTenantContext();
    const { data, error } = await this.supabase
      .from('content_items')
      .update(content)
      .eq('id', id)
      .select()
      .single();
    
    return this.handleResponse(data);
  }

  async deleteContent(id: string) {
    await this.setTenantContext();
    const { data, error } = await this.supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    return this.handleResponse(data);
  }
}
