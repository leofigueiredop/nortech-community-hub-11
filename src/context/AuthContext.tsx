import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AuthUser, AuthResponse, LoginCredentials, SignupType } from '@/types/api';
import { SupabaseAuthRepository } from '@/api/repositories/SupabaseAuthRepository';
import { SupabaseCommunityRepository } from '@/api/repositories/SupabaseCommunityRepository';
import { Community } from '@/api/interfaces/ICommunityRepository';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/api/config';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  communityContext: Community | null;
  setCommunityContext: (community: Community | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  updateOnboardingStep: (step: number) => void;
  currentOnboardingStep: number;
  handleAuthCallback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  communityContext: null,
  setCommunityContext: () => {},
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithApple: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  updateOnboardingStep: () => {},
  currentOnboardingStep: 1,
  handleAuthCallback: async () => { throw new Error('Not implemented') },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const navigate = useNavigate();

  const authRepository = new SupabaseAuthRepository();
  const communityRepository = new SupabaseCommunityRepository(createClient(supabaseConfig.url, supabaseConfig.anonKey));

  // Check for existing session and community context on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedCommunityContext = localStorage.getItem('nortechCommunityContext');
        
        if (storedCommunityContext) {
          const parsedContext = JSON.parse(storedCommunityContext);
          setCurrentCommunity(prev => ({
            ...prev,
            ...parsedContext
          }));
          
          // Set community context in API client
          if (parsedContext.communityId) {
            api.setCurrentCommunity(parsedContext.communityId);
          }
        }
        
        // Try to get current user from API
        const currentUser = await api.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.debug('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Store community context when it changes
  useEffect(() => {
    if (currentCommunity) {
      localStorage.setItem('nortechCommunityContext', JSON.stringify(currentCommunity));
    }
  }, [currentCommunity]);
  
  // Update API client when community context changes
  useEffect(() => {
    if (currentCommunity?.communityId) {
      api.setCurrentCommunity(currentCommunity.communityId);
    }
  }, [currentCommunity?.communityId]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authRepository.login(credentials);
      setUser(response.user);

      // Se o usuário for um criador, buscar sua comunidade
      if (response.user.role === 'admin' || response.user.role === 'creator') {
        const { data: communities } = await communityRepository.searchCommunities('', {
          status: 'active'
        });
        
        const userCommunity = communities?.find(c => c.creator_id === response.user.id);
        
        if (userCommunity) {
          setCurrentCommunity(userCommunity);
          localStorage.setItem('nortechCommunityContext', JSON.stringify(userCommunity));
          api.setCurrentCommunity(userCommunity.id);
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      const response = await api.auth.register({
        email,
        password,
        name,
        signupType: 'member'
      });
      
      setUser(response.user);
      setCurrentCommunity(null);
      localStorage.removeItem('nortechCommunityContext');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await api.auth.loginWithGoogle();
      // The user will be redirected to the Google login page
      // After successful login, they'll be redirected to the callback URL
      // where handleAuthCallback will process the response
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Could not sign in with Google",
        variant: "destructive"
      });
      throw error;
    }
  };

  const loginWithApple = async () => {
    // Implementation needed
  };

  const handleAuthCallback = async () => {
    try {
      const response = await authRepository.handleAuthCallback();
      setUser(response.user);

      // Se o usuário for um criador, buscar sua comunidade
      if (response.user.role === 'admin' || response.user.role === 'creator') {
        const { data: communities } = await communityRepository.searchCommunities('', {
          status: 'active'
        });
        
        const userCommunity = communities?.find(c => c.creator_id === response.user.id);
        
        if (userCommunity) {
          setCurrentCommunity(userCommunity);
          localStorage.setItem('nortechCommunityContext', JSON.stringify(userCommunity));
          api.setCurrentCommunity(userCommunity.id);
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Auth callback error:', error);
      navigate('/login');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      setCurrentCommunity(null);
      localStorage.removeItem('nortechCommunityContext');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Could not sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (user) {
      try {
        // TODO: Implement profile update in SupabaseAuthRepository
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
      } catch (error) {
        console.error('Profile update failed:', error);
        toast({
          title: "Profile update failed",
          description: error instanceof Error ? error.message : "Could not update profile",
          variant: "destructive"
        });
      }
    }
  };

  const updateOnboardingStep = (step: number) => {
    // Implementation needed
  };

  const value: AuthContextType = {
    user,
    isLoading: loading,
    communityContext: currentCommunity,
    setCommunityContext: setCurrentCommunity,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateProfile,
    updateOnboardingStep,
    currentOnboardingStep: 1,
    handleAuthCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
