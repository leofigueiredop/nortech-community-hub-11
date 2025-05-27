import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePointsSubscription } from '@/hooks/usePointsSubscription';
import { ApiClient } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';

// Define the types for points transactions
interface PointsActivity {
  id?: string;
  user_id: string;
  points: number;
  description: string;
  type: string;
  created_at: string;
}

// Define the type for new points activity data
type NewPointsActivity = Omit<PointsActivity, 'id'>;

// Points values for different activities
export const POINTS_VALUES = {
  content_view: 5,
  content_completion: 10,
  login_bonus: 2,
  profile_update: 5,
  challenge_completion: 50,
  quiz_completion: 25,
  reward_redemption: -50,
  login: 2,
  comment: 3,
  like: 1,
  course_completion: 20,
  event_participation: 15,
  referral: 25
};

// Points context interface
interface PointsContextType {
  totalPoints: number;
  pointsHistory: PointsActivity[];
  awardPoints: (points: number, description: string) => Promise<void>;
  redeemPoints: (points: number, description: string) => Promise<void>;
  addPoints: (pointsData: { type: string; description: string; points: number }) => void;
  deductPoints: (points: number, description?: string) => void;
  getUserLevel: () => { level: number; nextLevel: number; progress: number };
  awardBadge: (badge: { name: string; description: string; category: string }) => void;
}

// Create the context
const PointsContext = createContext<PointsContextType>({
  totalPoints: 0,
  pointsHistory: [],
  awardPoints: async () => {},
  redeemPoints: async () => {},
  addPoints: () => {},
  deductPoints: () => {},
  getUserLevel: () => ({ level: 1, nextLevel: 2, progress: 0 }),
  awardBadge: () => {}
});

// Points provider component
export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  usePointsSubscription();
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<PointsActivity[]>([]);
  const api = ApiClient.getInstance();

  // Subscribe to realtime points updates
  useEffect(() => {
    if (!user || !user.isOnboarded) return;
    
    const subscription = supabase
      .channel('points-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'points_transactions',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        // Update state when new points transaction occurs
        const newActivity = payload.new as PointsActivity;
        setPointsHistory(prev => [newActivity, ...prev]);
        setTotalPoints(prev => prev + newActivity.points);
        
        // Show toast notification
        if (newActivity.points > 0) {
          toast.success(`+${newActivity.points} points: ${newActivity.description}`);
        } else {
          toast.error(`${newActivity.points} points: ${newActivity.description}`);
        }
      })
      .subscribe();
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    // Load initial points data
    const loadPointsData = async () => {
      // Skip if no user or if user is in onboarding
      // if (!user || !user.isOnboarded) {
      //   setTotalPoints(0);
      //   setPointsHistory([]);
      //   return;
      // }
      if (!user) {
        setTotalPoints(0);
        setPointsHistory([]);
        return;
      }
      
      try {
        // First try to get user's total points from user_points table
        const { data: userPoints, error: userPointsError } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single();
          
        if (!userPointsError && userPoints) {
          setTotalPoints(userPoints.points);
        }
        
        // Fetch points history from points_transactions table
        const { data: history, error } = await supabase
          .from('points_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching points history:', error);
          toast.error('Failed to load points data');
          return;
        }

        if (history) {
          setPointsHistory(history);
          
          // If we didn't get points from user_points, calculate from history
          if (userPointsError || !userPoints) {
            const total = history.reduce((sum, activity) => sum + activity.points, 0);
            setTotalPoints(total);
          }
        }
      } catch (error) {
        console.error('Error loading points data:', error);
        toast.error('Failed to load points data');
      }
    };

    loadPointsData();
  }, [user]);

  const awardPoints = useCallback(async (points: number, description: string) => {
    if (!user) return;

    try {
      const activity = {
        user_id: user.id,
        points,
        description,
        source: 'app',
        community_id: user.currentCommunity || null,
        created_at: new Date().toISOString()
      };

      // Insert into points_transactions table
      const { error } = await supabase
        .from('points_transactions')
        .insert([activity]);

      if (error) {
        console.error('Error awarding points:', error);
        toast.error('Failed to award points');
        return;
      }

      // Update user_points table through RPC function
      if (user.currentCommunity) {
        const { error: rpcError } = await supabase.rpc('add_points', {
          user_id: user.id,
          community_id: user.currentCommunity,
          points_to_add: points
        });
        
        if (rpcError) {
          console.error('Error updating user points total:', rpcError);
        }
      }

      // Update local state
      setTotalPoints(prev => prev + points);
      setPointsHistory(prev => [{
        ...activity,
        id: uuidv4(),
        type: points > 0 ? 'points_earned' : 'points_spent'
      } as PointsActivity, ...prev]);
      
      toast.success(`${points > 0 ? '+' : ''}${points} points: ${description}`);
    } catch (error) {
      console.error('Error in awardPoints:', error);
      toast.error('Failed to award points');
    }
  }, [user]);

  // Legacy support for the original addPoints method
  const addPoints = useCallback((pointsData: { type: string; description: string; points: number }) => {
    awardPoints(pointsData.points, pointsData.description);
  }, [awardPoints]);

  // Deduct points from the user
  const deductPoints = useCallback(async (points: number, description = 'Points redeemed') => {
    if (!user) return;
    
    // Always convert to positive number then make negative for consistency
    const pointsToDeduct = Math.abs(points) * -1;
    
    // Call awardPoints with negative value
    await awardPoints(pointsToDeduct, description);
  }, [user, awardPoints]);

  // Award badge (simplified implementation)
  const awardBadge = useCallback((badge: { name: string; description: string; category: string }) => {
    console.log(`Badge awarded: ${badge.name} (${badge.category})`);
    // In a real implementation, this would save the badge to user's profile
    toast.success(`🏆 Badge awarded: ${badge.name}`);
  }, []);

  // Calculate user level based on total points
  const getUserLevel = useCallback(() => {
    const pointsPerLevel = 100;
    const level = Math.floor(totalPoints / pointsPerLevel) + 1;
    const nextLevel = level + 1;
    const currentLevelPoints = totalPoints - ((level - 1) * pointsPerLevel);
    const progress = Math.floor((currentLevelPoints / pointsPerLevel) * 100);
    
    return { level, nextLevel, progress };
  }, [totalPoints]);

  const redeemPoints = useCallback(async (points: number, description: string) => {
    if (!user || points > totalPoints) {
      if (points > totalPoints) {
        toast.error("You don't have enough points for this redemption");
      }
      return;
    }

    try {
      // Use deductPoints to handle the redemption
      await deductPoints(points, description);
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error('Failed to redeem points');
    }
  }, [user, totalPoints, deductPoints]);

  return (
    <PointsContext.Provider value={{
      totalPoints,
      pointsHistory,
      awardPoints,
      redeemPoints,
      addPoints,
      deductPoints,
      getUserLevel,
      awardBadge
    }}>
      {children}
    </PointsContext.Provider>
  );
};

// Export the hook for using points context
export const usePoints = () => useContext(PointsContext);
