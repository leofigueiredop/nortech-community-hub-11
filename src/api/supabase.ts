
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './ApiClient';

export const createClient = () => {
  return createSupabaseClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
  );
};
