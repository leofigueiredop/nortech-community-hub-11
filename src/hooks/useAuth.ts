
import { useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { AuthUser } from '@/types/api';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await api.auth.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.auth.login({ email, password });
    setUser(response.user);
    return response;
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await api.auth.register({ email, password, name });
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
