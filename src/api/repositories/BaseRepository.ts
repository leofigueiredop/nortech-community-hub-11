
import { createClient, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config';
import { ApiResponse } from '@/types/api';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export class BaseRepository implements IBaseRepository {
  protected supabase: SupabaseClient;
  protected currentCommunityId: string | null = null;

  constructor() {
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  setCommunityContext(communityId: string | null): void {
    this.currentCommunityId = communityId;
  }

  protected async setTenantContext(): Promise<void> {
    if (this.currentCommunityId) {
      // Set Postgres RLS policy context
      await this.supabase.rpc('set_tenant_context', { community_uuid: this.currentCommunityId });
    }
  }

  protected handleError<T>(error: unknown): Promise<T> {
    console.error('Repository error:', error);
    
    // Get appropriate error message
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if ((error as PostgrestError)?.message) {
      errorMessage = (error as PostgrestError).message;
    }
    
    throw new Error(errorMessage);
  }

  protected async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as T;
  }
}
