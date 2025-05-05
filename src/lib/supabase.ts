import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../api/config';

export { supabaseConfig };

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'nortech-auth-token',
    debug: import.meta.env.DEV
  }
});

// Helper function to handle authentication errors
export const handleAuthError = (error: any) => {
  console.error('Authentication Error:', error);
  let message = 'An error occurred during authentication.';

  if (error.message) {
    message = error.message;
  } else if (error.error_description) {
    message = error.error_description;
  } else if (error.statusText) {
    message = error.statusText;
  }

  return { data: null, error: { message } };
};