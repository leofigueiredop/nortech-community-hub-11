import { useState, useCallback, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CommunityMember } from '@/types/community';
import { MemberFilters } from '@/api/interfaces/IMembersRepository';
import { differenceInDays, formatDistance } from 'date-fns';

// Expandir interface ExtendedMember para incluir subscription_plan_id opcional
export interface ExtendedMember extends CommunityMember {
  lastActive?: string;
  subscription_plan_id?: string | null;
}

export const useRealMembers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<ExtendedMember[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [newMembersCount, setNewMembersCount] = useState<number>(0);
  const { user, community } = useAuth();
  const { toast } = useToast();

  // Load all members
  const loadAllMembers = useCallback(async (filters?: MemberFilters) => {
    setLoading(true);
    try {
      const { data, error } = await api.members.getAllMembers(filters);
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert joined_at string to last active string
        const membersWithActivity = data.map(member => ({
          ...member,
          lastActive: formatLastActive(member.joined_at)
        }));
        setMembers(membersWithActivity);
      }
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load counts
  const loadCounts = useCallback(async () => {
    try {
      // Load total members count
      const totalResult = await api.members.getMembersCount();
      if (totalResult.ok && totalResult.data !== undefined) {
        setTotalMembers(totalResult.data);
      }
      
      // Load new members count (last 7 days)
      const newResult = await api.members.getNewMembersCount(7);
      if (newResult.ok && newResult.data !== undefined) {
        setNewMembersCount(newResult.data);
      }
    } catch (error) {
      console.error('Error loading member counts:', error);
    }
  }, []);

  // Update member role
  const updateMemberRole = useCallback(async (userId: string, role: string) => {
    setLoading(true);
    try {
      const { error } = await api.members.updateMemberRole(userId, role);
      if (error) {
        throw error;
      }
      
      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member.user_id === userId 
            ? { ...member, role: role as any }
            : member
        )
      );
      
      toast({
        title: 'Role Updated',
        description: `Member role has been updated to ${role}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: 'Update Failed',
        description: 'Unable to update member role',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Invite a new member
  const inviteMember = useCallback(async (email: string, role: string = 'member') => {
    setLoading(true);
    try {
      const { error } = await api.members.inviteMember(email, role);
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Invitation Sent',
        description: `Invitation has been sent to ${email}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Invitation Failed',
        description: 'Unable to send invitation',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Remove a member
  const removeMember = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await api.members.removeMember(userId);
      if (error) {
        throw error;
      }
      
      // Update local state
      setMembers(prev => prev.filter(member => member.user_id !== userId));
      setTotalMembers(prev => Math.max(0, prev - 1));
      
      toast({
        title: 'Member Removed',
        description: 'The member has been removed from the community',
      });
      
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Removal Failed',
        description: 'Unable to remove the member',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter members by various criteria
  const filterMembers = useCallback((members: ExtendedMember[], filters: {
    role?: string | string[];
    plan?: string;
    search?: string;
  }) => {
    return members.filter(member => {
      // Filter by role
      if (filters.role) {
        if (Array.isArray(filters.role)) {
          if (!filters.role.includes(member.role)) {
            return false;
          }
        } else if (member.role !== filters.role) {
          return false;
        }
      }
      
      // Filter by plan (needs to be implemented based on your data structure)
      // This is a placeholder assuming there's a plan field in your data
      if (filters.plan && filters.plan !== 'all') {
        // Example implementation - adjust based on your actual data structure
        const memberPlan = member.subscription_plan_id ? 'Premium' : 'Free';
        if (filters.plan === 'premium' && memberPlan !== 'Premium') {
          return false;
        }
        if (filters.plan === 'free' && memberPlan !== 'Free') {
          return false;
        }
      }
      
      // Filter by search query
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = member.profile?.name?.toLowerCase().includes(searchLower);
        const emailMatch = member.profile?.email?.toLowerCase().includes(searchLower);
        if (!nameMatch && !emailMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, []);

  // Helper function to format last active
  const formatLastActive = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Format the time distance in a human-readable way
      return formatDistance(date, now, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting last active date:', error);
      return 'Unknown';
    }
  };

  return {
    loading,
    members,
    totalMembers,
    newMembersCount,
    loadAllMembers,
    loadCounts,
    updateMemberRole,
    inviteMember,
    removeMember,
    filterMembers
  };
}; 