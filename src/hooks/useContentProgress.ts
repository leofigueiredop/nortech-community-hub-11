
import { useState } from 'react';
import { ContentProgress } from '@/types/library';
import { v4 as uuidv4 } from 'uuid';

export const useContentProgress = () => {
  const [contentProgress, setContentProgress] = useState<ContentProgress[]>([
    {
      id: '1',
      userId: 'user1',
      contentId: 'content1',
      progress: 75,
      completed: false,
      lastAccessedAt: new Date().toISOString(),
      pointsAwarded: false
    },
    {
      id: '2',
      userId: 'user1',
      contentId: 'content2',
      progress: 100,
      completed: true,
      lastAccessedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      pointsAwarded: true
    }
  ]);

  const updateProgress = (contentId: string, progress: number) => {
    setContentProgress(prev => prev.map(item => {
      if (item.contentId === contentId) {
        const completed = progress >= 100;
        return {
          ...item,
          progress,
          completed,
          lastAccessedAt: new Date().toISOString()
        };
      }
      return item;
    }));
  };

  const addProgress = (contentId: string) => {
    const existing = contentProgress.find(p => p.contentId === contentId);
    if (!existing) {
      setContentProgress(prev => [
        ...prev,
        {
          id: uuidv4(),
          userId: 'user1', // In a real app, this would be the current user's ID
          contentId,
          progress: 0,
          completed: false,
          lastAccessedAt: new Date().toISOString(),
          pointsAwarded: false
        }
      ]);
    }
  };

  const getProgress = (contentId: string) => {
    return contentProgress.find(p => p.contentId === contentId) || null;
  };

  const awardPoints = (contentId: string) => {
    setContentProgress(prev => prev.map(item => {
      if (item.contentId === contentId) {
        return {
          ...item,
          pointsAwarded: true
        };
      }
      return item;
    }));
  };

  return {
    contentProgress,
    updateProgress,
    addProgress,
    getProgress,
    awardPoints
  };
};
