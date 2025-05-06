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

  protected handleError(error: any): never {
    console.error('Repository error:', error);
    throw error;
  }

  protected async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    if (response.error) {
      if (typeof response.error === 'string') {
        throw new Error(response.error);
      } else if (response.error.message) {
        throw new Error(response.error.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
    return response.data as T;
  }
}
