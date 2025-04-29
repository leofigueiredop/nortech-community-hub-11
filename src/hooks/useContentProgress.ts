
import { useState, useCallback } from 'react';
import { ContentProgress } from '@/types/library';

// Interface para uso interno que simplifica o acesso aos dados
interface NormalizedProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percent: number;
  completed_at: string | null;
  last_accessed_at: string;
  points_awarded: boolean;
}

export const useContentProgress = () => {
  // Mock state for demonstration
  const [progress, setProgress] = useState<ContentProgress[]>([
    {
      id: 'progress1',
      user_id: 'user1',
      content_id: 'content1', 
      progress_percent: 100,
      completed_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      points_awarded: true
    },
    {
      id: 'progress2',
      user_id: 'user1',
      content_id: 'content2',
      progress_percent: 50,
      completed_at: null,
      last_accessed_at: new Date().toISOString(),
      points_awarded: false
    }
  ]);

  const addProgress = useCallback((contentId: string) => {
    setProgress(prev => {
      // Skip if content already has progress
      if (prev.some(p => p.content_id === contentId)) {
        return prev;
      }
      
      const now = new Date().toISOString();
      
      // Create new progress
      const newProgress: ContentProgress = {
        id: `progress-${Date.now()}`,
        user_id: 'user1', // In a real app, this would come from an auth context
        content_id: contentId,
        progress_percent: 0,
        completed_at: null,
        last_accessed_at: now,
        points_awarded: false
      };
      
      return [...prev, newProgress];
    });
  }, []);

  const updateProgress = useCallback((contentId: string, newProgress: number) => {
    setProgress(prev => {
      return prev.map(p => {
        if (p.content_id === contentId) {
          const isCompleted = newProgress >= 100;
          const now = new Date().toISOString();
          return {
            ...p,
            progress_percent: newProgress,
            completed_at: isCompleted ? now : p.completed_at,
            last_accessed_at: now
          };
        }
        return p;
      });
    });
  }, []);

  const getProgress = useCallback((contentId: string) => {
    const item = progress.find(p => p.content_id === contentId);
    if (!item) {
      // Return default values
      const now = new Date().toISOString();
      const defaultProgress: ContentProgress = {
        id: '',
        user_id: 'user1',
        content_id: contentId,
        progress_percent: 0,
        completed_at: null,
        last_accessed_at: now,
        points_awarded: false
      };
      return defaultProgress;
    }
    return item;
  }, [progress]);

  const awardPoints = useCallback((contentId: string) => {
    setProgress(prev => {
      return prev.map(p => {
        if (p.content_id === contentId) {
          return {
            ...p,
            points_awarded: true
          };
        }
        return p;
      });
    });
  }, []);

  const getAllProgress = useCallback(() => {
    return progress;
  }, [progress]);
  
  // Get progress for all items with a specific format
  const getFormatProgress = useCallback((format: string, contentList: any[]) => {
    const formatItems = contentList.filter(item => item.format === format);
    const formatItemIds = formatItems.map(item => item.id);
    
    return progress.filter(p => formatItemIds.includes(p.content_id));
  }, [progress]);
  
  // Get stats about content consumption
  const getContentStats = useCallback(() => {
    const total = progress.length;
    const completed = progress.filter(p => p.completed_at !== null).length;
    const inProgress = progress.filter(p => p.progress_percent > 0 && p.completed_at === null).length;
    const notStarted = progress.filter(p => p.progress_percent === 0).length;
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }, [progress]);

  return {
    contentProgress: progress,
    addProgress,
    updateProgress,
    getProgress,
    awardPoints,
    getAllProgress,
    getFormatProgress,
    getContentStats
  };
};
