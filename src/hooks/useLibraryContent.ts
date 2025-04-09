
import { useState, useCallback } from 'react';
import { ContentItem, ContentFormat, ContentCategory, Course, CourseModule } from '@/types/library';

// Mock data for the library
const CONTENT_ITEMS: ContentItem[] = [
  {
    id: '1',
    title: 'Introduction to Web3 Development',
    description: 'Learn the basics of Web3 development and blockchain technology',
    format: 'video',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/video1',
    tags: ['Web3', 'Development', 'Blockchain'],
    accessLevel: 'free',
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-09-15T10:30:00Z',
    duration: '45:21',
    views: 1243,
    featured: true
  },
  {
    id: '2',
    title: 'Advanced Smart Contract Patterns',
    description: 'Deep dive into advanced smart contract patterns and best practices',
    format: 'pdf',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/pdf1',
    tags: ['Web3', 'Smart Contracts', 'Solidity'],
    accessLevel: 'premium',
    createdAt: '2023-10-02T14:15:00Z',
    updatedAt: '2023-10-05T09:20:00Z',
    fileSize: '3.2 MB',
    views: 765
  },
  {
    id: '3',
    title: 'Financial Freedom Blueprint',
    description: 'A comprehensive guide to achieving financial independence',
    format: 'pdf',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/pdf2',
    tags: ['Finance', 'Wealth Building'],
    accessLevel: 'free',
    createdAt: '2023-08-20T08:45:00Z',
    updatedAt: '2023-08-22T11:30:00Z',
    fileSize: '4.7 MB',
    views: 2187
  },
  {
    id: '4',
    title: 'Mindset Mastery Audio Series',
    description: 'Transform your mindset with this powerful audio series',
    format: 'audio',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/audio1',
    tags: ['Mindset', 'Personal Development'],
    accessLevel: 'premium',
    createdAt: '2023-07-10T16:20:00Z',
    updatedAt: '2023-07-12T13:10:00Z',
    duration: '3:15:42',
    views: 894
  },
  {
    id: '5',
    title: 'Growth Strategy Resources',
    description: 'Collection of essential resources for business growth',
    format: 'link',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/resources',
    tags: ['Business', 'Growth', 'Strategy'],
    accessLevel: 'free',
    createdAt: '2023-11-05T09:30:00Z',
    updatedAt: '2023-11-05T09:30:00Z',
    views: 567
  },
  {
    id: '6',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamentals of creating user-friendly interfaces',
    format: 'video',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/video2',
    tags: ['Design', 'UI/UX'],
    accessLevel: 'free',
    createdAt: '2023-10-18T13:45:00Z',
    updatedAt: '2023-10-20T10:15:00Z',
    duration: '37:52',
    views: 1089
  },
  {
    id: '7',
    title: 'Crypto Market Analysis',
    description: 'In-depth analysis of current cryptocurrency market trends',
    format: 'image',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/image1',
    tags: ['Crypto', 'Finance', 'Analysis'],
    accessLevel: 'premium',
    createdAt: '2023-11-10T11:20:00Z',
    updatedAt: '2023-11-10T11:20:00Z',
    views: 432
  },
  {
    id: '8',
    title: 'Productivity Framework',
    description: 'A step-by-step framework to 10x your productivity',
    format: 'text',
    thumbnailUrl: '/placeholder.svg',
    resourceUrl: 'https://example.com/text1',
    tags: ['Productivity', 'Mindset'],
    accessLevel: 'free',
    createdAt: '2023-09-28T15:10:00Z',
    updatedAt: '2023-09-30T09:45:00Z',
    views: 876
  }
];

const CATEGORIES: ContentCategory[] = [
  { id: '1', name: 'Web3', description: 'Blockchain and decentralized technologies', count: 3 },
  { id: '2', name: 'Finance', description: 'Financial education and wealth building', count: 3 },
  { id: '3', name: 'Mindset', description: 'Personal development and mental strategies', count: 3 },
  { id: '4', name: 'Design', description: 'UI/UX and visual design principles', count: 1 },
  { id: '5', name: 'Business', description: 'Business growth and strategy', count: 1 },
  { id: '6', name: 'Development', description: 'Software and web development', count: 2 }
];

// Mock data for courses
const COURSES: Course[] = [
  {
    id: '1',
    title: 'Complete Web3 Development Bootcamp',
    description: 'Comprehensive course covering the fundamentals of Web3 development',
    thumbnailUrl: '/placeholder.svg',
    modules: [
      {
        id: '1-1',
        title: 'Introduction to Blockchain',
        description: 'Learn the basics of blockchain technology',
        contentItems: ['1', '2'],
        order: 1,
        duration: '1:30:00'
      },
      {
        id: '1-2',
        title: 'Smart Contract Development',
        description: 'Building and deploying smart contracts',
        contentItems: ['3', '4'],
        order: 2,
        duration: '2:15:00'
      }
    ],
    accessLevel: 'premium',
    createdAt: '2023-10-20T14:30:00Z',
    updatedAt: '2023-11-05T09:45:00Z',
    views: 876,
    featured: true,
    tags: ['Web3', 'Development', 'Blockchain', 'Smart Contracts']
  },
  {
    id: '2',
    title: 'Financial Freedom Masterclass',
    description: 'Step-by-step guide to achieving financial independence',
    thumbnailUrl: '/placeholder.svg',
    modules: [
      {
        id: '2-1',
        title: 'Wealth Building Foundations',
        description: 'Core principles of building lasting wealth',
        contentItems: ['5'],
        order: 1,
        duration: '1:15:00'
      },
      {
        id: '2-2',
        title: 'Investment Strategies',
        description: 'Advanced investment techniques for growth',
        contentItems: ['6', '7'],
        order: 2,
        duration: '1:45:00'
      }
    ],
    accessLevel: 'free',
    createdAt: '2023-09-10T11:20:00Z',
    updatedAt: '2023-10-15T13:30:00Z',
    views: 1245,
    tags: ['Finance', 'Wealth Building', 'Investment']
  }
];

export const useLibraryContent = () => {
  const [content, setContent] = useState<ContentItem[]>(CONTENT_ITEMS);
  const [categories, setCategories] = useState<ContentCategory[]>(CATEGORIES);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Get all unique tags from content items
  const allTags = Array.from(
    new Set(content.flatMap(item => item.tags))
  ).sort();

  // Get all formats
  const allFormats = Array.from(
    new Set(content.map(item => item.format))
  );

  // Filter content based on current filters
  const filteredContent = content.filter(item => {
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
    const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);
    const matchesAccess = accessFilter === 'all' || item.accessLevel === accessFilter;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFormat && matchesTag && matchesAccess && matchesSearch;
  });

  // Get featured content
  const featuredContent = content.filter(item => item.featured);

  // Add new content
  const addContent = useCallback((newContent: ContentItem) => {
    setContent(prev => [...prev, newContent]);
    
    // Update category count
    if (newContent.categoryId) {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === newContent.categoryId 
            ? { ...cat, count: cat.count + 1 } 
            : cat
        )
      );
    }
  }, []);

  // Update existing content
  const updateContent = useCallback((updatedContent: ContentItem) => {
    setContent(prev => {
      const existingItem = prev.find(item => item.id === updatedContent.id);
      
      // Handle category count changes
      if (existingItem && existingItem.categoryId !== updatedContent.categoryId) {
        setCategories(categories => {
          let newCategories = [...categories];
          
          // Decrease count in old category
          if (existingItem.categoryId) {
            newCategories = newCategories.map(cat => 
              cat.id === existingItem.categoryId 
                ? { ...cat, count: Math.max(0, cat.count - 1) } 
                : cat
            );
          }
          
          // Increase count in new category
          if (updatedContent.categoryId) {
            newCategories = newCategories.map(cat => 
              cat.id === updatedContent.categoryId 
                ? { ...cat, count: cat.count + 1 } 
                : cat
            );
          }
          
          return newCategories;
        });
      }
      
      return prev.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      );
    });
  }, []);

  // Delete content
  const deleteContent = useCallback((id: string) => {
    setContent(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      
      // Update category count
      if (itemToDelete?.categoryId) {
        setCategories(categories => 
          categories.map(cat => 
            cat.id === itemToDelete.categoryId 
              ? { ...cat, count: Math.max(0, cat.count - 1) } 
              : cat
          )
        );
      }
      
      return prev.filter(item => item.id !== id);
    });
  }, []);

  // Course functions
  const addCourse = useCallback((newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  }, []);

  const updateCourse = useCallback((updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  // Add category
  const addCategory = useCallback((category: ContentCategory) => {
    setCategories(prev => [...prev, category]);
  }, []);

  // Update category
  const updateCategory = useCallback((updatedCategory: ContentCategory) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  }, []);

  // Delete category
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    
    // Remove category from content items
    setContent(prev => 
      prev.map(item => 
        item.categoryId === id 
          ? { ...item, categoryId: undefined } 
          : item
      )
    );
  }, []);

  return {
    content,
    filteredContent,
    featuredContent,
    categories,
    courses,
    allTags,
    allFormats,
    formatFilter,
    tagFilter,
    accessFilter,
    searchQuery,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery,
    setSelectedItem,
    addContent,
    updateContent,
    deleteContent,
    addCourse,
    updateCourse,
    deleteCourse,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
