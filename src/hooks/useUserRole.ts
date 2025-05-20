import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/ApiClient';

export type UserRole = 'owner' | 'admin' | 'moderator' | 'member' | 'none';

interface UseUserRoleResult {
  role: UserRole;
  isOwner: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isMember: boolean;
  loading: boolean;
  error: string | null;
}

export function useUserRole(): UseUserRoleResult {
  const { user, community } = useAuth();
  const [role, setRole] = useState<UserRole>('none');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !community) {
        setRole('none');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // First check if the user is the creator/owner of the community
        if (community.owner_id === user.id) {
          setRole('owner');
          setLoading(false);
          return;
        }

        // Query the community_members table to get the role
        const { data, error } = await api.supabase
          .from('community_members')
          .select('role')
          .eq('community_id', community.id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole('none');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user role');
        // Fallback to checking if the user is at least a member
        setRole(user && community ? 'member' : 'none');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, community]);

  return {
    role,
    isOwner: role === 'owner',
    isAdmin: role === 'owner' || role === 'admin',
    isModerator: role === 'owner' || role === 'admin' || role === 'moderator',
    isMember: role === 'owner' || role === 'admin' || role === 'moderator' || role === 'member',
    loading,
    error
  };
} 