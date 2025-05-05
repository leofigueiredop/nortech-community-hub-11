import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AuthUser, AuthResponse } from '@/types/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  communityContext: {
    communityId: string;
    communityName: string;
    creatorName: string;
    branding: {
      logo: string;
      primaryColor: string;
      bannerUrl: string;
    };
    entryType: 'free' | 'premium';
  } | null;
  setCommunityContext: (context: any) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  updateOnboardingStep: (step: number) => void;
  currentOnboardingStep: number;
  handleAuthCallback: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  communityContext: null,
  setCommunityContext: () => {},
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  updateOnboardingStep: () => {},
  currentOnboardingStep: 1,
  handleAuthCallback: async () => { throw new Error('Not implemented') },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [communityContext, setCommunityContext] = useState<AuthContextType['communityContext']>(null);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);
  const navigate = useNavigate();

  // Check for existing session and community context on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedCommunityContext = localStorage.getItem('nortechCommunityContext');
        
        if (storedCommunityContext) {
          const parsedContext = JSON.parse(storedCommunityContext);
          setCommunityContext(prev => ({
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
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Store community context when it changes
  useEffect(() => {
    if (communityContext) {
      localStorage.setItem('nortechCommunityContext', JSON.stringify(communityContext));
    }
  }, [communityContext]);
  
  // Update API client when community context changes
  useEffect(() => {
    if (communityContext?.communityId) {
      api.setCurrentCommunity(communityContext.communityId);
    }
  }, [communityContext?.communityId]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Starting login...');
      const response = await api.auth.login({ email, password });
      
      if (!response.user) {
        throw new Error('No user data returned from authentication');
      }

      console.log('Login successful, user:', response.user.id);
      
      // Set user state
      setUser(response.user);
      
      // If user is a creator, redirect to dashboard
      if (response.user.role === 'creator' || response.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        // For regular users, continue with onboarding
        setCurrentOnboardingStep(3); // Move to profile setup
        navigate('/auth/profile-setup');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.register({
        email,
        password,
        name,
        signupType: 'member'
      });
      
      setUser(response.user);
      setCurrentOnboardingStep(3); // Move to profile setup after registration
      navigate('/auth/profile-setup');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
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

  const handleAuthCallback = async () => {
    try {
      const response = await api.auth.handleAuthCallback();
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Auth callback failed:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Could not complete authentication",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      setCommunityContext(null);
      setCurrentOnboardingStep(1);
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
    setCurrentOnboardingStep(step);
  };

  const value = {
    user,
    isLoading,
    communityContext,
    setCommunityContext,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    updateOnboardingStep,
    currentOnboardingStep,
    handleAuthCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
