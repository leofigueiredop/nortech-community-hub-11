import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

class ApiClient {
  private static instance: ApiClient;
  public supabase;

  private constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setCurrentCommunity(communityId: string) {
    // Set tenant context for RLS policies
    this.supabase.rpc('set_tenant_context', { tenant_id: communityId });
  }
}

export const api = ApiClient.getInstance(); 