import { useEffect } from 'react';
import { ApiClient } from '@/api/ApiClient';
import { usePoints } from '@/context/PointsContext';
import { useAuth } from '@/hooks/useAuth';

export const usePointsSubscription = () => {
  const api = ApiClient.getInstance();
  const { user } = useAuth();
  const { awardPoints } = usePoints();

  useEffect(() => {
    if (!user) return;

    // Subscribe to points channel for the current user
    const pointsChannel = api.supabase
      .channel(`points:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'points_transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Update points in context when new transaction is received
          awardPoints({
            type: payload.new.source,
            description: payload.new.description,
            points: payload.new.points
          });
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
      pointsChannel.unsubscribe();
      leaderboardChannel.unsubscribe();
    };
  }, [user, api.supabase, awardPoints]);
}; 