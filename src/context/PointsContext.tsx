
import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the types for points transactions
export interface PointsActivity {
  id: string;
  type: string;
  points: number;
  description: string;
  timestamp: string;
}

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

// Define the structure of the Points context
export interface PointsContextType {
  totalPoints: number;
  points: number;
  awardPoints: (pointsData: { type: string; description: string; points: number }) => void;
  addPoints: (pointsData: { type: string; description: string; points: number }) => void;
  deductPoints: (points: number, description?: string) => void;
  getUserLevel: () => { level: number; nextLevel: number; progress: number };
  pointsHistory: PointsActivity[];
  awardBadge: (badge: { name: string; description: string; category: string }) => void;
}

// Create the context
const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Points provider component
export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pointsHistory, setPointsHistory] = useState<PointsActivity[]>([
    {
      id: '1',
      type: 'login_bonus',
      points: 2,
      description: 'Daily login bonus',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      type: 'content_completion',
      points: 10,
      description: 'Completed "Getting Started with Our Platform"',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  // Calculate total points
  const totalPoints = pointsHistory.reduce((sum, activity) => sum + activity.points, 0);

  // Award points to the user (new version using object parameter)
  const awardPoints = useCallback((pointsData: { type: string; description: string; points: number }) => {
    const newActivity: PointsActivity = {
      id: Date.now().toString(),
      type: pointsData.type,
      points: pointsData.points,
      description: pointsData.description,
      timestamp: new Date().toISOString(),
    };
    
    setPointsHistory(prev => [newActivity, ...prev]);
  }, []);

  // Legacy support for the original addPoints method
  const addPoints = useCallback((pointsData: { type: string; description: string; points: number }) => {
    awardPoints(pointsData);
  }, [awardPoints]);

  // Deduct points from the user
  const deductPoints = useCallback((points: number, description = '') => {
    const newActivity: PointsActivity = {
      id: Date.now().toString(),
      type: 'reward_redemption',
      points: -Math.abs(points), // Ensure it's negative
      description,
      timestamp: new Date().toISOString(),
    };
    
    setPointsHistory(prev => [newActivity, ...prev]);
  }, []);

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

  return (
    <PointsContext.Provider value={{
      totalPoints,
      points: totalPoints, // For backward compatibility
      awardPoints,
      addPoints,
      deductPoints,
      getUserLevel,
      pointsHistory,
      awardBadge
    }}>
      {children}
    </PointsContext.Provider>
  );
};

// Hook to use the points context
export const usePoints = () => {
  const context = useContext(PointsContext);
  
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  
  return context;
};
