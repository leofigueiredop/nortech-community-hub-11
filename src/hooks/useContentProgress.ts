
import { useState, useCallback } from 'react';
import { ContentProgress } from '@/types/library';

export const useContentProgress = () => {
  // Mock state for demonstration
  const [progress, setProgress] = useState<ContentProgress[]>([
    {
      id: 'progress1',
      userId: 'user1',
      contentId: 'content1', 
      progress: 100,
      completed: true,
      lastAccessedAt: new Date().toISOString(),
      pointsAwarded: true
    },
    {
      id: 'progress2',
      userId: 'user1',
      contentId: 'content2',
      progress: 50,
      completed: false,
      lastAccessedAt: new Date().toISOString(),
      pointsAwarded: false
    }
  ]);

  const addProgress = useCallback((contentId: string) => {
    setProgress(prev => {
      // Skip if content already has progress
      if (prev.some(p => p.contentId === contentId)) {
        return prev;
      }
      
      // Add new progress entry
      return [...prev, {
        id: `progress-${Date.now()}`,
        userId: 'user1', // In a real app, this would come from an auth context
        contentId,
        progress: 0,
        completed: false,
        lastAccessedAt: new Date().toISOString(),
        pointsAwarded: false
      }];
    });
  }, []);

  const updateProgress = useCallback((contentId: string, newProgress: number) => {
    setProgress(prev => {
      return prev.map(p => {
        if (p.contentId === contentId) {
          return {
            ...p,
            progress: newProgress,
            completed: newProgress >= 100,
            lastAccessedAt: new Date().toISOString()
          };
        }
        return p;
      });
    });
  }, []);

  const getProgress = useCallback((contentId: string) => {
    const item = progress.find(p => p.contentId === contentId);
    if (!item) {
      // Return default values if no progress found
      return {
        id: '',
        userId: 'user1',
        contentId,
        progress: 0,
        completed: false,
        lastAccessedAt: new Date().toISOString(),
        pointsAwarded: false
      };
    }
    return item;
  }, [progress]);

  const awardPoints = useCallback((contentId: string) => {
    setProgress(prev => {
      return prev.map(p => {
        if (p.contentId === contentId) {
          return {
            ...p,
            pointsAwarded: true
          };
        }
        return p;
      });
    });
  }, []);

  const getAllProgress = useCallback(() => {
    return progress;
  }, [progress]);

  // This hook now matches the expectations of components that use it
  return {
    contentProgress: progress,
    addProgress,
    updateProgress,
    getProgress,
    awardPoints,
    getAllProgress
  };
};
