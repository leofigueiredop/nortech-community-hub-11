
import React, { createContext, useContext, useState, useEffect } from 'react';

// Badge interface
export interface Badge {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: 'event' | 'achievement' | 'role' | 'custom';
  createdAt: Date;
}

export interface PointsActivity {
  id: string;
  type: 'login' | 'comment' | 'like' | 'course_completion' | 'event_participation' | 'referral' | 'content_view' | 'content_completion';
  description: string;
  points: number;
  timestamp: Date;
  badge?: Badge; // Optional badge awarded with points
}

interface PointsContextType {
  totalPoints: number;
  pointsHistory: PointsActivity[];
  userBadges: Badge[];
  awardPoints: (activity: Omit<PointsActivity, 'id' | 'timestamp'>) => void;
  addPoints: (activity: Omit<PointsActivity, 'id' | 'timestamp'>) => void; // Adding this function as an alias
  awardBadge: (badge: Omit<Badge, 'id' | 'createdAt'>) => void;
  getUserLevel: () => { level: number; nextLevel: number; progress: number };
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Point values for different activities
export const POINTS_VALUES = {
  login: 5,
  comment: 3,
  like: 1,
  course_completion: 50,
  event_participation: 20,
  referral: 25,
  content_view: 2,
  content_completion: 10
};

// Level thresholds
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000, 10000];

// Mock data for demonstrations
const MOCK_POINTS_HISTORY: PointsActivity[] = [
  {
    id: '1',
    type: 'login',
    description: 'Daily login bonus',
    points: POINTS_VALUES.login,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '2',
    type: 'comment',
    description: 'Comment on "React Best Practices"',
    points: POINTS_VALUES.comment,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '3',
    type: 'course_completion',
    description: 'Completed "Web3 Fundamentals" course',
    points: POINTS_VALUES.course_completion,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
];

// Mock badges
const MOCK_BADGES: Badge[] = [
  {
    id: '1',
    name: 'Early Adopter',
    description: 'Joined during the platform launch phase',
    category: 'role',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Course Champion',
    description: 'Completed 5 courses',
    category: 'achievement',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  }
];

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pointsHistory, setPointsHistory] = useState<PointsActivity[]>(MOCK_POINTS_HISTORY);
  const [userBadges, setUserBadges] = useState<Badge[]>(MOCK_BADGES);
  
  // Calculate total points
  const totalPoints = pointsHistory.reduce((total, activity) => total + activity.points, 0);
  
  const awardPoints = (activity: Omit<PointsActivity, 'id' | 'timestamp'>) => {
    const newActivity: PointsActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setPointsHistory(prev => [newActivity, ...prev]);
    
    // Log to console for debugging
    console.log(`Points awarded: ${activity.points} for ${activity.type}`);
  };
  
  // Adding addPoints as an alias for awardPoints to maintain compatibility
  const addPoints = awardPoints;
  
  // Function to award badges
  const awardBadge = (badge: Omit<Badge, 'id' | 'createdAt'>) => {
    // Check if user already has this badge
    if (userBadges.some(b => b.name === badge.name)) {
      console.log(`User already has the "${badge.name}" badge`);
      return;
    }
    
    const newBadge: Badge = {
      ...badge,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setUserBadges(prev => [...prev, newBadge]);
    
    console.log(`Badge awarded: ${badge.name}`);
  };
  
  // Function to determine user level based on total points
  const getUserLevel = () => {
    let level = 0;
    
    // Find current level
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (totalPoints >= LEVEL_THRESHOLDS[i]) {
        level = i;
      } else {
        break;
      }
    }
    
    // Calculate progress to next level
    const currentLevelThreshold = LEVEL_THRESHOLDS[level];
    const nextLevelThreshold = level < LEVEL_THRESHOLDS.length - 1 
      ? LEVEL_THRESHOLDS[level + 1] 
      : currentLevelThreshold * 2;
    
    const pointsForNextLevel = nextLevelThreshold - currentLevelThreshold;
    const pointsEarnedTowardsNextLevel = totalPoints - currentLevelThreshold;
    const progress = Math.min(Math.floor((pointsEarnedTowardsNextLevel / pointsForNextLevel) * 100), 100);
    
    return {
      level,
      nextLevel: level + 1,
      progress
    };
  };
  
  // Check for daily login bonus (once per day)
  useEffect(() => {
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLoginDate !== today) {
      // Award login points
      awardPoints({
        type: 'login',
        description: 'Daily login bonus',
        points: POINTS_VALUES.login
      });
      
      // Update last login date
      localStorage.setItem('lastLoginDate', today);
    }
  }, []);
  
  return (
    <PointsContext.Provider
      value={{
        totalPoints,
        pointsHistory,
        userBadges,
        awardPoints,
        addPoints, // Adding the alias to the context value
        awardBadge,
        getUserLevel,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
