
import { useState } from 'react';
import { ContentItem, ContentFormat, ContentCategory } from '@/types/library';

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

export const useLibraryContent = () => {
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Get all unique tags from content items
  const allTags = Array.from(
    new Set(CONTENT_ITEMS.flatMap(item => item.tags))
  ).sort();

  // Get all formats
  const allFormats = Array.from(
    new Set(CONTENT_ITEMS.map(item => item.format))
  );

  // Filter content based on current filters
  const filteredContent = CONTENT_ITEMS.filter(item => {
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
    const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);
    const matchesAccess = accessFilter === 'all' || item.accessLevel === accessFilter;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFormat && matchesTag && matchesAccess && matchesSearch;
  });

  // Get featured content
  const featuredContent = CONTENT_ITEMS.filter(item => item.featured);

  return {
    content: CONTENT_ITEMS,
    filteredContent,
    featuredContent,
    categories: CATEGORIES,
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
    setSelectedItem
  };
};
