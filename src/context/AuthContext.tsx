
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem('nortechUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Store user data when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nortechUser', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Mock login functionality - would connect to backend in real app
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: AuthUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        accessLevel: communityContext?.entryType || 'free',
        interests: [],
        communityId: communityContext?.communityId,
        communityName: communityContext?.communityName,
        creatorName: communityContext?.creatorName,
        isOnboarded: false
      };
      
      setUser(mockUser);
      setCurrentOnboardingStep(3); // Move to profile setup after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser: AuthUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        accessLevel: communityContext?.entryType || 'free',
        interests: [],
        communityId: communityContext?.communityId,
        communityName: communityContext?.communityName,
        creatorName: communityContext?.creatorName,
        isOnboarded: false
      };
      
      setUser(mockUser);
      setCurrentOnboardingStep(3); // Move to profile setup after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful Google login
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nortechUser');
    setUser(null);
    setCommunityContext(null);
    setCurrentOnboardingStep(1);
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

  return (
    <AuthContext.Provider 
      value={{ 
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
