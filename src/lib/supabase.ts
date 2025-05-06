import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'x-application-name': 'nortech-community-hub'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Check if there's an active Supabase session
 * @returns Object containing session data and error (if any)
 */
export const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (err) {
    console.error('Failed to check session:', err);
    return { session: null, error: err };
  }
};

/**
 * Process auth errors and return user-friendly messages
 * @param error The error object from Supabase
 * @returns A user-friendly error message
 */
export const handleAuthError = (error: any): string => {
  console.error('Auth error:', error);
  
  if (!error) return 'An unknown error occurred';
  
  // Network errors
  if (
    (error.message && 
     (error.message.includes('fetch') || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')))
  ) {
    return 'Connection error. Please check your internet connection and try again.';
  }
  
  // Handle Supabase Auth errors
  const message = error.message || error.error_description || error.toString();
  
  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before logging in';
  }
  
  if (message.includes('Email link is invalid or has expired')) {
    return 'The login link is invalid or has expired. Please request a new one';
  }
  
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please try again later';
  }
  
  return message; // Return original message if no specific handler
};