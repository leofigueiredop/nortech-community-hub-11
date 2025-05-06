import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types/api';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export class BaseRepository implements IBaseRepository {
  protected supabase: SupabaseClient;
  protected currentCommunityId: string | null = null;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
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

  protected handleError(error: any): never {
    console.error('Repository error:', error);
    throw error;
  }

  protected async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as T;
  }
}
