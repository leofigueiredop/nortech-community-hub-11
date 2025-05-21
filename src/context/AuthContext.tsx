import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, AuthResponse } from '@/api/interfaces/IAuthRepository';
import { CommunityContext } from '@/types/community';
import { api } from '@/api/ApiClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkSession, handleAuthError } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  community: CommunityContext | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  createCommunity: (communityData: {
    name: string;
    description: string;
    logo_url?: string | null;
    category?: string;
    is_private?: boolean;
  }) => Promise<CommunityContext>;
  handleAuthCallback: () => Promise<AuthResponse>;
  currentOnboardingStep: number;
  setCurrentOnboardingStep: (step: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [community, setCommunity] = useState<CommunityContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);
  const navigate = useNavigate();

  // Function to update community context in ApiClient
  const updateCommunityContext = (communityData: CommunityContext) => {
    console.log('Updating community context:', communityData);
    
    // Set community in state
    setCommunity(communityData);
    
    // Make sure we have an ID before setting tenant context
    if (communityData?.id) {
      // Set tenant context in ApiClient to ensure all DB queries have proper RLS
      api.setCurrentCommunity(communityData.id);
      
      // Store community ID in localStorage for persistence
      localStorage.setItem('currentCommunityId', communityData.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing authentication');
        setIsLoading(true);
        
        // First check if we have a session
        const { session, error: sessionError } = await checkSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (!session) {
          console.log('No active session found');
          setIsLoading(false);
          return;
        }

        console.log('Active session found, fetching full auth data');
        
        // If we have a session, get the full auth response
        try {
          const authResponse = await api.auth.getSession();
          console.log('Auth response received:', authResponse);
          
          setUser(authResponse.user);
          
          // Update community context
          if (authResponse.community) {
            updateCommunityContext(authResponse.community);
          }
        } catch (authError) {
          console.error('Error getting full auth data:', authError);
          // Don't throw here, the session exists but we couldn't get full data
          // This allows the user to still be logged in but they'll need to refresh
          
          // Check if it's a "no community access" error and redirect to onboarding
          if (authError instanceof Error && 
              authError.message.includes('No community access')) {
            // Redirect to community creation page
            navigate('/onboarding/welcome');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // Display error toast for user feedback
        toast({
          title: 'Authentication Error',
          description: error instanceof Error ? error.message : 'Failed to initialize authentication',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      setIsLoading(true);
      
      const authResponse = await api.auth.login(email, password);
      console.log('Login successful:', authResponse);
      
      setUser(authResponse.user);
      
      // Update community context
      if (authResponse.community) {
        updateCommunityContext(authResponse.community);
        
        // Redirect to dashboard on successful login with community access
        navigate('/dashboard');
      } else {
        // Redirect to onboarding if no community access
        navigate('/onboarding/welcome');
      }
      
      // Show success toast
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Let the login page handle the error UI
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Registering new user with email:', email);
      setIsLoading(true);
      
      const authResponse = await api.auth.register(email, password, fullName);
      console.log('Registration successful:', authResponse);
      
      setUser(authResponse.user);
      
      // Community will be null at this point - user needs to create or join one
      // Redirect to onboarding/welcome to start community creation
      navigate('/onboarding/welcome');
      
      // Show success toast
      toast({
        title: 'Registration Successful',
        description: 'Account created! Now create or join a community.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Let the registration page handle the error UI
    } finally {
      setIsLoading(false);
    }
  };

  const createCommunity = async (communityData: {
    name: string;
    description: string;
    logo_url?: string | null;
    category?: string;
    is_private?: boolean;
  }) => {
    try {
      console.log('Creating new community:', communityData.name);
      setIsLoading(true);
      
      const community = await api.auth.createCommunity(communityData);
      console.log('Community created successfully:', community);
      
      // Update community context
      updateCommunityContext(community);
      
      // Show success toast
      toast({
        title: 'Community Created',
        description: `Your community "${community.name}" has been created successfully!`,
      });
      
      return community;
    } catch (error) {
      console.error('Create community error:', error);
      
      // Show error toast
      toast({
        title: 'Community Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create community',
        variant: 'destructive',
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      setIsLoading(true);
      
      // First, sign out from Supabase (server-side session termination)
      await api.auth.logout();
      
      // Clear all potential auth-related items from localStorage
      localStorage.removeItem('currentCommunityId');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      // Clear all Supabase-related cookies as an additional measure
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('sb-') || name.includes('supabase')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // Clear state
      setUser(null);
      setCommunity(null);
      
      // Reset API client tenant context
      api.setCurrentCommunity(null);
      
      // Force page reload to ensure clean state if needed
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local state even if server logout fails
      setUser(null);
      setCommunity(null);
      localStorage.removeItem('currentCommunityId');
      api.setCurrentCommunity(null);
      
      // Force navigation to login page as fallback
      window.location.href = '/auth/login';
      
      toast({
        title: 'Logout failed',
        description: 'There was an error during logout, but we\'ve cleared your local session.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async () => {
    console.log('Handling auth callback');
    setIsLoading(true);
    
    try {
      const authResponse = await api.auth.handleAuthCallback();
      console.log('Auth callback successful:', authResponse);
      
      setUser(authResponse.user);
      
      // Update community context
      if (authResponse.community) {
        updateCommunityContext(authResponse.community);
      }
      
      return authResponse;
    } catch (error) {
      console.error('Auth callback error:', error);
      
      // Check if it's a "no community access" error and redirect to onboarding
      if (error instanceof Error && 
          error.message.includes('No community access')) {
        // Redirect to community creation page
        navigate('/onboarding/welcome');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    community,
    isLoading,
    login,
    logout,
    register,
    createCommunity,
    handleAuthCallback,
    currentOnboardingStep,
    setCurrentOnboardingStep,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
