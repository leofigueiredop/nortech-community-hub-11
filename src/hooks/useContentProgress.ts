
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the ContentProgress interface
interface ContentProgress {
  id: string;
  userId: string;
  contentId: string;
  progress: number;
  completed: boolean;
  lastAccessedAt: string;
  pointsAwarded: boolean;
}

// Mock initial progress data
const initialProgressData: ContentProgress[] = [
  {
    id: 'progress-1',
    userId: 'user-1',
    contentId: 'c1',
    progress: 100,
    completed: true,
    lastAccessedAt: new Date().toISOString(),
    pointsAwarded: true
  },
  {
    id: 'progress-2',
    userId: 'user-1',
    contentId: 'c2',
    progress: 45,
    completed: false,
    lastAccessedAt: new Date(Date.now() - 86400000).toISOString(),
    pointsAwarded: false
  }
];

export const useContentProgress = () => {
  const [progressData, setProgressData] = useState<ContentProgress[]>(initialProgressData);

  // Add a new content item to progress tracking
  const addProgress = useCallback((contentId: string) => {
    setProgressData(prev => {
      // Check if progress already exists
      const exists = prev.some(p => p.contentId === contentId);
      if (exists) return prev;
      
      // Create new progress entry
      const newProgress: ContentProgress = {
        id: `progress-${Date.now()}`,
        userId: 'user-1', // Mock user ID
        contentId,
        progress: 0,
        completed: false,
        lastAccessedAt: new Date().toISOString(),
        pointsAwarded: false
      };
      
      return [...prev, newProgress];
    });
  }, []);

  // Update progress for a content item
  const updateProgress = useCallback((contentId: string, newProgress: number) => {
    setProgressData(prev => {
      return prev.map(p => {
        if (p.contentId === contentId) {
          const completed = newProgress >= 100;
          return {
            ...p,
            progress: newProgress,
            completed,
            lastAccessedAt: new Date().toISOString()
          };
        }
        return p;
      });
    });
  }, []);

  // Get progress for a content item
  const getProgress = useCallback((contentId: string) => {
    return progressData.find(p => p.contentId === contentId);
  }, [progressData]);

  // Award points for a content item
  const awardPoints = useCallback((contentId: string) => {
    setProgressData(prev => {
      return prev.map(p => {
        if (p.contentId === contentId && !p.pointsAwarded) {
          toast({
            title: "Points Awarded!",
            description: "You've earned points for completing this content.",
          });
          
          return {
            ...p,
            pointsAwarded: true
          };
        }
        return p;
      });
    });
  }, []);

  // Get all progress items
  const getAllProgress = useCallback(() => {
    return progressData;
  }, [progressData]);

  return {
    addProgress,
    updateProgress,
    getProgress,
    awardPoints,
    getAllProgress
  };
};
