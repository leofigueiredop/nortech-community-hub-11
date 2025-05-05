import { useEffect } from 'react';
import { ApiClient } from '@/api/ApiClient';
import { usePoints } from '@/context/PointsContext';
import { useAuth } from '@/context/AuthContext';

export const usePointsSubscription = () => {
  const api = ApiClient.getInstance();
  const { user } = useAuth();
  const { updatePoints } = usePoints();

  useEffect(() => {
    if (!user) return;

    const channel = api.supabase
      .channel('points_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && payload.new.points !== undefined) {
            updatePoints(payload.new.points);
          }
        }
      )
      .subscribe();

    // Subscribe to leaderboard changes
    const leaderboardChannel = api.supabase
      .channel('leaderboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_points'
        },
        () => {
          // Trigger leaderboard refresh in UI
          // This will be handled by SWR's revalidation
          api.points.getUserPoints(user.id);
        }
      )
      .subscribe();

    return () => {
      api.supabase.removeChannel(channel);
      leaderboardChannel.unsubscribe();
    };
  }, [user, api.supabase, updatePoints]);
}; 