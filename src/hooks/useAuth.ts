
import { useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { AuthUser } from '@/types/api';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const user = await api.auth.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.auth.register({ email, password, name });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
