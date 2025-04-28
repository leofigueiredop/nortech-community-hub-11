
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

export const createClient = () => {
  return createSupabaseClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
  );
};
