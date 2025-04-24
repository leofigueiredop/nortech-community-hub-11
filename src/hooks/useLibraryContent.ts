
import { useState } from 'react';
import { ContentItem } from '@/types/library';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';
import { sampleCourse } from '@/data/mockCourseData';
import { useContentItems } from '@/hooks/useContentItems';

export const useLibraryContent = () => {
  // We'll extend the base useContentItems hook to get all filtering functionality
  const contentItemsHook = useContentItems();
  
  const [content] = useState<ContentItem[]>([
    {
      id: sampleCourse.id,
      title: sampleCourse.title,
      description: sampleCourse.description,
      format: 'course',
      thumbnail: sampleCourse.thumbnail,
      author: {
        id: 'author-1',
        name: 'John Smith',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      tags: ['react', 'javascript', 'web development'],
      createdAt: '2024-04-23T10:00:00Z',
      updatedAt: '2024-04-23T10:00:00Z',
      views: 1250,
      duration: 21600, // 6 hours in seconds
      accessLevel: 'free', // Changed from premium to free
      featured: true,
      pointsEnabled: true,
      pointsValue: 500,
      ...sampleCourse
    },
    ...CONTENT_ITEMS
  ]);

  // Return both the local content state and all the filtering functionality from useContentItems
  return {
    ...contentItemsHook,
    content,
    loading: false,
    error: null
  };
};
