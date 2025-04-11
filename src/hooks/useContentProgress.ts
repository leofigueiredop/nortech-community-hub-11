
import { useState, useEffect } from 'react';
import { ContentProgress, ContentItem } from '@/types/library';

// Mock data - in a real app, this would be fetched from a database
const MOCK_PROGRESS: ContentProgress[] = [
  {
    userId: 'current-user',
    contentId: '1',
    progress: 100,
    completed: true,
    lastAccessed: new Date().toISOString(),
    pointsAwarded: true
  },
  {
    userId: 'current-user',
    contentId: '3',
    progress: 45,
    completed: false,
    lastAccessed: new Date().toISOString(),
    pointsAwarded: false
  },
];

export const useContentProgress = () => {
  const [progressData, setProgressData] = useState<ContentProgress[]>(MOCK_PROGRESS);
  
  const getContentProgress = (contentId: string): ContentProgress | undefined => {
    return progressData.find(item => item.contentId === contentId);
  };
  
  const updateProgress = (contentId: string, progress: number, completed: boolean = false) => {
    setProgressData(prev => {
      const existing = prev.find(item => item.contentId === contentId);
      
      if (existing) {
        return prev.map(item => 
          item.contentId === contentId 
            ? { 
                ...item, 
                progress, 
                completed: completed || progress === 100,
                lastAccessed: new Date().toISOString()
              } 
            : item
        );
      } else {
        return [...prev, {
          userId: 'current-user', // In a real app, get from auth
          contentId,
          progress,
          completed: completed || progress === 100,
          lastAccessed: new Date().toISOString(),
          pointsAwarded: false
        }];
      }
    });
  };
  
  const markPointsAwarded = (contentId: string) => {
    setProgressData(prev => 
      prev.map(item => 
        item.contentId === contentId 
          ? { ...item, pointsAwarded: true } 
          : item
      )
    );
  };
  
  const getCompletedContent = () => {
    return progressData.filter(item => item.completed);
  };
  
  const getInProgressContent = () => {
    return progressData.filter(item => !item.completed && item.progress > 0);
  };
  
  return {
    progressData,
    getContentProgress,
    updateProgress,
    markPointsAwarded,
    getCompletedContent,
    getInProgressContent
  };
};
