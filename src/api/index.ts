import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

class ApiClient {
  private static instance: ApiClient;
  public supabase;

  private constructor() {
    this.supabase = supabase;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setCurrentCommunity(communityId: string) {
    // Set tenant context for RLS policies
    this.supabase.rpc('set_tenant_context', { tenant_id: communityId })
      .catch(err => console.error('Error setting tenant context:', err));
  }
}

export const api = ApiClient.getInstance(); 