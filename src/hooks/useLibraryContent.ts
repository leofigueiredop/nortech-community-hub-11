import { useState } from 'react';
import { ContentItem, ContentCategory } from '@/types/library';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';
import { sampleCourse } from '@/data/mockCourseData';
import { useContentItems } from '@/hooks/useContentItems';

export const useLibraryContent = () => {
  // We'll extend the base useContentItems hook to get all filtering functionality
  const contentItemsHook = useContentItems();
  
  // Mock categories for components that expect them
  const [categories] = useState<ContentCategory[]>([
    { 
      id: 'cat-1',
      name: 'Development',
      description: 'Programming and development content',
      itemCount: 15,
      icon: '💻',
      slug: 'development',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    { 
      id: 'cat-2',
      name: 'Design',
      description: 'UI/UX and graphic design',
      itemCount: 8,
      icon: '🎨',
      slug: 'design',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    { 
      id: 'cat-3',
      name: 'Business',
      description: 'Business and entrepreneurship',
      itemCount: 12,
      icon: '💼',
      slug: 'business',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    { 
      id: 'cat-4',
      name: 'Marketing',
      description: 'Digital marketing and SEO',
      itemCount: 9,
      icon: '📈',
      slug: 'marketing',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ]);
  
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

  const addCategory = (category: ContentCategory) => {
    console.log('Adding category:', category);
  };

  const updateCategory = (category: ContentCategory) => {
    console.log('Updating category:', category);
  };

  const deleteCategory = (id: string) => {
    console.log('Deleting category:', id);
  };

  return {
    ...contentItemsHook,
    content,
    loading: false,
    error: null,
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
