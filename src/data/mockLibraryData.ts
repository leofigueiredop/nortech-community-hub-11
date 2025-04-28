import { ContentItem, ContentCategory, ContentFormat } from '@/types/library';

export const CATEGORIES: ContentCategory[] = [
  {
    id: 'cat1',
    name: 'Getting Started',
    description: 'Introduction to the platform and basic concepts',
    itemCount: 5,
    icon: 'rocket',
    slug: 'getting-started',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'cat2',
    name: 'Tutorials',
    description: 'Step-by-step guides for common tasks',
    itemCount: 8,
    icon: 'book-open',
    slug: 'tutorials',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 'cat3',
    name: 'Advanced Topics',
    description: 'Deep dives into complex subjects',
    itemCount: 3,
    icon: 'zap',
    slug: 'advanced-topics',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  },
  {
    id: 'cat4',
    name: 'Community Resources',
    description: 'Content created by community members',
    itemCount: 6,
    icon: 'users',
    slug: 'community-resources',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z'
  }
];

// Mock content items for the library
export const CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'c1',
    title: 'Getting Started with Our Platform',
    description: 'A comprehensive introduction to the platform features and capabilities.',
    format: 'video' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'John Doe',
    tags: ['beginner', 'intro', 'tutorial'],
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    views: 1547,
    duration: 732, // Duration in seconds
    accessLevel: 'free',
    featured: true,
    categoryId: 'cat1',
    allowComments: true,
    freeAccessesLeft: 0,
    isNew: true
  },
  {
    id: 'c2',
    title: 'Advanced User Management Techniques',
    description: 'Learn how to effectively manage users and permissions in complex organizations.',
    format: 'pdf' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Jane Smith',
    tags: ['advanced', 'management', 'permissions'],
    createdAt: '2023-04-22T14:45:00Z',
    updatedAt: '2023-05-10T09:15:00Z',
    views: 986,
    duration: 900, // Estimated reading time in seconds
    accessLevel: 'premium',
    featured: false,
    categoryId: 'cat3',
    allowComments: true,
    freeAccessesLeft: 2
  },
  {
    id: 'c3',
    title: 'Building Your First Integration',
    description: 'Step-by-step guide to creating your first API integration with our platform.',
    format: 'audio' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: {
      id: 'u1',
      name: 'Mark Johnson',
      avatar: 'https://via.placeholder.com/100'
    },
    tags: ['api', 'integration', 'tutorial'],
    createdAt: '2023-05-05T11:20:00Z',
    updatedAt: '2023-05-05T11:20:00Z',
    views: 753,
    duration: 1845, // Duration in seconds
    accessLevel: 'free',
    featured: true,
    categoryId: 'cat2',
    isExclusive: true
  },
  {
    id: 'c4',
    title: 'Performance Optimization Strategies',
    description: 'Discover techniques to improve system performance and reduce latency.',
    format: 'video' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Sarah Williams',
    tags: ['performance', 'optimization', 'advanced'],
    createdAt: '2023-04-10T08:30:00Z',
    updatedAt: '2023-04-15T16:40:00Z',
    views: 1254,
    duration: 1200, // Duration in seconds
    accessLevel: 'premium',
    featured: false,
    categoryId: 'cat3'
  },
  {
    id: 'c5',
    title: 'Community Guidelines and Best Practices',
    description: 'An overview of our community guidelines and recommended practices.',
    format: 'pdf' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Community Team',
    tags: ['community', 'guidelines'],
    createdAt: '2023-05-01T09:00:00Z',
    updatedAt: '2023-05-01T09:00:00Z',
    views: 632,
    duration: 600, // Estimated reading time in seconds
    accessLevel: 'free',
    featured: false,
    categoryId: 'cat4'
  },
  {
    id: 'c6',
    title: 'External Resources Compilation',
    description: 'A curated list of external resources to complement your learning journey.',
    format: 'link' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: {
      id: 'u2',
      name: 'Resource Team',
      avatar: 'https://via.placeholder.com/100'
    },
    tags: ['resources', 'links', 'learning'],
    createdAt: '2023-03-20T13:15:00Z',
    updatedAt: '2023-05-12T10:20:00Z',
    views: 879,
    duration: 300, // Estimated exploration time in seconds
    accessLevel: 'free',
    featured: false,
    categoryId: 'cat4'
  },
  {
    id: 'c7',
    title: 'Security Best Practices',
    description: 'Learn how to secure your applications and protect user data.',
    format: 'video' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Alex Chen',
    tags: ['security', 'privacy', 'best-practices'],
    createdAt: '2023-04-28T15:30:00Z',
    updatedAt: '2023-04-28T15:30:00Z',
    views: 1032,
    duration: 1560, // Duration in seconds
    accessLevel: 'premium',
    featured: true,
    categoryId: 'cat2',
    isNew: true
  },
  {
    id: 'c8',
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to common problems encountered by users.',
    format: 'image' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: {
      id: 'u3',
      name: 'Support Team',
      avatar: 'https://via.placeholder.com/100'
    },
    tags: ['troubleshooting', 'support', 'help'],
    createdAt: '2023-05-08T11:45:00Z',
    updatedAt: '2023-05-08T11:45:00Z',
    views: 1476,
    duration: 900, // Estimated reading time in seconds
    accessLevel: 'free',
    featured: false,
    categoryId: 'cat1'
  },
  {
    id: 'c9',
    title: 'Advanced Analytics Dashboard',
    description: 'How to leverage our advanced analytics dashboard for business insights.',
    format: 'course' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Data Insights Team',
    tags: ['analytics', 'dashboard', 'data'],
    createdAt: '2023-04-18T09:20:00Z',
    updatedAt: '2023-05-20T14:15:00Z',
    views: 896,
    duration: 2700, // Duration in seconds
    accessLevel: 'premium',
    featured: true,
    categoryId: 'cat3',
    pointsEnabled: true,
    pointsValue: 200,
    isExclusive: true
  },
  {
    id: 'c10',
    title: 'Quick Start Guide for New Users',
    description: 'Get up and running with our platform in less than 10 minutes.',
    format: 'pdf' as ContentFormat,
    thumbnail: 'https://via.placeholder.com/800x450',
    author: 'Onboarding Team',
    tags: ['quick-start', 'beginner'],
    createdAt: '2023-05-17T08:10:00Z',
    updatedAt: '2023-05-17T08:10:00Z',
    views: 2134,
    duration: 480, // Estimated reading time in seconds
    accessLevel: 'free',
    featured: false,
    categoryId: 'cat1',
    isNew: true
  }
];
