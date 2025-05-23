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

  // Skip subscription during onboarding
  // useEffect(() => {
  //   if (!user || !user.isOnboarded) return;
  //   usePointsSubscription();
  // }, [user]);



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
      
      // Fetch points history from points_transactions table
      const { data: history, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching points history:', error);
        toast.error('Failed to load points data');
        return;
      }

      if (history) {
        setPointsHistory(history);
        // Calculate total points
        const total = history.reduce((sum, activity) => sum + activity.points, 0);
        setTotalPoints(total);
      }
    };

    loadPointsData();
  }, [user]);

  const awardPoints = useCallback(async (points: number, description: string) => {
    if (!user) return;

    try {
      const activity: NewPointsActivity = {
        user_id: user.id,
        points,
        description,
        type: 'points_earned',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('points_history')
        .insert([activity]);

      if (error) {
        console.error('Error awarding points:', error);
        toast.error('Failed to award points');
        return;
      }

      // Update local state
      setTotalPoints(prev => prev + points);
      setPointsHistory(prev => [activity as PointsActivity, ...prev]);
      toast.success(`Awarded ${points} points!`);
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
  const deductPoints = useCallback(async (points: number, description = '') => {
    if (!user) return;

    const newActivity: PointsActivity = {
      id: Date.now().toString(),
      type: 'reward_redemption',
      points: -Math.abs(points), // Ensure it's negative
      description,
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    
    setPointsHistory(prev => [newActivity, ...prev]);
    setTotalPoints(prev => prev - Math.abs(points));

    // Sync with backend
    await api.points.addPoints(
      user.id,
      -Math.abs(points),
      'reward_redemption',
      description
    );
  }, [user]);

  // Award badge (simplified implementation)
  const awardBadge = useCallback((badge: { name: string; description: string; category: string }) => {
    console.log(`Badge awarded: ${badge.name} (${badge.category})`);
    // In a real implementation, this would save the badge to user's profile
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
    if (!user || points > totalPoints) return;

    try {
      const newActivity: PointsActivity = {
        id: uuidv4(),
        type: 'reward_redemption',
        points: -points,
        description,
        created_at: new Date().toISOString(),
        user_id: user.id
      };

      // Update local state
      setTotalPoints(prev => prev - points);
      setPointsHistory(prev => [newActivity, ...prev]);

      // Save to database
      await api.points.addPoints(
        user.id,
        -points,
        'reward_redemption',
        description
      );
    } catch (error) {
      console.error('Error redeeming points:', error);
    }
  }, [user, totalPoints]);

  const addPointsActivity = async (activity: NewPointsActivity) => {
    if (!user) return;
    
    const newActivity: PointsActivity = {
      id: uuidv4(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      ...activity
    };

    setPointsHistory(prev => [...prev, newActivity]);
    
    try {
      await supabase
        .from('points_transactions')
        .insert([newActivity]);
    } catch (error) {
      console.error('Error saving points activity:', error);
      toast.error('Failed to save points activity');
    }
  };

  const loadPointsHistory = async () => {
    // if (!user || !user.isOnboarded) return;
    if (!user) return;
    
    try {
      const { data: history, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading points history:', error);
        toast.error('Failed to load points history');
        return;
      }

      setPointsHistory(history);
    } catch (error) {
      console.error('Error in loadPointsHistory:', error);
      toast.error('Failed to load points history');
    }
  };

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
