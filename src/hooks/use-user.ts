
import { useState, useEffect } from 'react';
import { api } from '@/api/ApiClient';

interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  access_level?: 'free' | 'premium' | 'premium_plus';
}

export const useUser = () => {
  const [user, setUser] = useState<User>({
    id: 'user-1', // Default mock user
    email: 'demo@example.com',
    display_name: 'Demo User',
    avatar_url: 'https://ui-avatars.com/api/?name=Demo+User',
    role: 'member',
    access_level: 'free'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const currentUser = await api.auth.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            display_name: currentUser.name,
            avatar_url: currentUser.avatar_url,
            role: currentUser.role || 'member',
            access_level: currentUser.access_level || 'free'
          });
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    setLoading(true);
    try {
      // In a real app, this would call an API to update the user
      // For now, we'll just update the local state
      setUser(prev => ({ ...prev, ...updates }));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    updateUser
  };
};
