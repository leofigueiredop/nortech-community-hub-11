
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { toast } from '@/components/ui/use-toast';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  accessLevel: 'free' | 'premium';
  interests: string[];
  communityId?: string;
  communityName?: string;
  creatorName?: string;
  isOnboarded: boolean;
};

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
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  updateOnboardingStep: (step: number) => void;
  currentOnboardingStep: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  communityContext: null,
  setCommunityContext: () => {},
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateProfile: () => {},
  updateOnboardingStep: () => {},
  currentOnboardingStep: 1,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [communityContext, setCommunityContext] = useState<AuthContextType['communityContext']>(null);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);

  // Check for existing session and community context on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('nortechUser');
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
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // Try to get user from API
          const apiUser = await api.auth.getCurrentUser();
          if (apiUser) {
            const authUser: AuthUser = {
              id: apiUser.id,
              name: apiUser.name || '',
              email: apiUser.email,
              accessLevel: 'free',
              interests: [],
              isOnboarded: false,
            };
            setUser(authUser);
            localStorage.setItem('nortechUser', JSON.stringify(authUser));
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Store user data when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nortechUser', JSON.stringify(user));
    }
  }, [user]);
  
  // Update API client when community context changes
  useEffect(() => {
    if (communityContext?.communityId) {
      api.setCurrentCommunity(communityContext.communityId);
    }
  }, [communityContext?.communityId]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.login({ email, password });
      
      const authUser: AuthUser = {
        id: response.user.id,
        name: response.user.name || email.split('@')[0],
        email: response.user.email,
        accessLevel: communityContext?.entryType || 'free',
        interests: [],
        communityId: communityContext?.communityId,
        communityName: communityContext?.communityName,
        creatorName: communityContext?.creatorName,
        isOnboarded: false
      };
      
      setUser(authUser);
      setCurrentOnboardingStep(3); // Move to profile setup after login
      
      return;
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
      const response = await api.auth.register({ email, password, name });
      
      const authUser: AuthUser = {
        id: response.user.id,
        name: response.user.name || name,
        email: response.user.email,
        accessLevel: communityContext?.entryType || 'free',
        interests: [],
        communityId: communityContext?.communityId,
        communityName: communityContext?.communityName,
        creatorName: communityContext?.creatorName,
        isOnboarded: false
      };
      
      setUser(authUser);
      setCurrentOnboardingStep(3); // Move to profile setup after registration
      
      return;
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
    setIsLoading(true);
    
    try {
      // Note: This is just a placeholder as we don't have Google auth implemented yet
      // In a real implementation, we would call an API endpoint for Google auth
      toast({
        title: "Google authentication",
        description: "Google authentication is not implemented yet with Supabase",
      });
      
      // Simulate successful Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: AuthUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'google.user@example.com',
        avatar: 'https://via.placeholder.com/150',
        accessLevel: communityContext?.entryType || 'free',
        interests: [],
        communityId: communityContext?.communityId,
        communityName: communityContext?.communityName,
        creatorName: communityContext?.creatorName,
        isOnboarded: false
      };
      
      setUser(mockUser);
      setCurrentOnboardingStep(3); // Skip to profile setup (with data already filled)
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: "Google login failed",
        description: "There was an error signing in with Google",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      localStorage.removeItem('nortechUser');
      setUser(null);
      setCommunityContext(null);
      setCurrentOnboardingStep(1);
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "There was an error during logout",
        variant: "destructive"
      });
    }
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
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
    currentOnboardingStep
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
