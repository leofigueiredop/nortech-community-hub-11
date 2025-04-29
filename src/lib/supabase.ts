import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/api/config';

export { supabaseConfig };

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle authentication errors
export const handleAuthError = (error: any) => {
  console.error('Authentication Error:', error);
  // You can add more sophisticated error handling here
  // For example, showing a toast notification
  return error;
};