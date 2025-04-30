import { useState, useEffect } from 'react';
import { supabase, handleAuthError } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthHook {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: {
    withEmail: (email: string, password: string) => Promise<{ data: any; error: any }>;
    withGoogle: () => Promise<{ data: any; error: any }>;
    withApple: () => Promise<{ data: any; error: any }>;
  };
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  emailConfirmation: {
    sendConfirmation: (email: string) => Promise<{ data: any; error: any }>;
    verifyToken: (token: string) => Promise<{ data: any; error: any }>;
  };
  handleAuthCallback: () => Promise<{ data: any; error: any }>;
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const signIn = {
    withEmail: (email: string, password: string) => 
      supabase.auth.signInWithPassword({ email, password })
        .then(result => result)
        .catch(handleAuthError),
    
    withGoogle: () => 
      supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
        .then(result => result)
        .catch(handleAuthError),
    
    withApple: () => 
      supabase.auth.signInWithOAuth({ 
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'name email',
        }
      })
        .then(result => result)
        .catch(handleAuthError)
  };

  const signUp = (email: string, password: string, options?: any) => 
    supabase.auth.signUp({ 
      email, 
      password, 
      options: {
        ...options,
        emailRedirectTo: import.meta.env.VITE_EMAIL_REDIRECT_URL
      }
    })
      .then(result => result)
      .catch(handleAuthError);

  const signOut = () => 
    supabase.auth.signOut()
      .then(result => result)
      .catch(handleAuthError);

  const resetPassword = (email: string) => 
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL
    })
      .then(result => result)
      .catch(handleAuthError);

  const emailConfirmation = {
    sendConfirmation: (email: string) => 
      supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: import.meta.env.VITE_EMAIL_REDIRECT_URL
        }
      })
        .then(result => result)
        .catch(handleAuthError),
    
    verifyToken: (token: string) => 
      supabase.auth.exchangeCodeForSession(token)
        .then(result => result)
        .catch(handleAuthError)
  };

  const handleAuthCallback = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;
      if (!session) throw new Error('No session found');

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      return { data: { session, user }, error: null };
    } catch (error) {
      console.error('Auth callback error:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    emailConfirmation,
    handleAuthCallback
  };
}
