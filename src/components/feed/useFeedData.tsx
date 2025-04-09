
import { useState, useEffect } from 'react';
import { PostProps } from '@/components/post/Post';

const samplePosts: PostProps[] = [
  {
    id: '1',
    author: {
      name: 'Pablo Silva',
      avatar: '',
      role: 'Admin'
    },
    title: 'Welcome to our community!',
    content: 'Hello everyone! Welcome to our new community platform. This is a space for us to share knowledge, help each other, and grow together.\n\nFeel free to introduce yourself and let us know what you\'re hoping to get out of this community!',
    createdAt: 'Today at 10:35 AM',
    likes: 24,
    comments: 7,
    space: 'Announcements',
    isPinned: true,
    isAnnouncement: true,
    tags: ['Welcome', 'Community'],
    accessBadge: 'free'
  },
  {
    id: '2',
    author: {
      name: 'Maria Souza',
      avatar: '',
    },
    content: 'I just completed the first module of the course and it was amazing! The content is very well structured and easy to follow. I especially liked the practical examples.',
    createdAt: 'Yesterday at 3:22 PM',
    likes: 15,
    comments: 3,
    space: 'General Discussion',
    tags: ['Course', 'Feedback'],
    accessBadge: 'free'
  },
  {
    id: '3',
    author: {
      name: 'Carlos Fernandes',
      avatar: '',
      role: 'Mentor'
    },
    title: 'New Resources Available',
    content: 'Hey everyone! I\'ve just uploaded some new resources that might be helpful for those working on the side project challenge:\n\n- Template for business canvas\n- Guide to validate your idea quickly\n- List of free tools for prototyping\n\nYou can find all of these in the Resources section. Let me know if you have any questions!',
    createdAt: '2 days ago',
    likes: 42,
    comments: 11,
    space: 'Premium Group',
    isPaid: true,
    teaser: 'Hey everyone! I\'ve just uploaded some new resources that might be helpful for those working on the side project challenge...',
    tags: ['Resources', 'Projects'],
    accessBadge: 'premium'
  },
  {
    id: '4',
    author: {
      name: 'Ana Vitória',
      avatar: '',
      role: 'Mentor'
    },
    title: 'Upcoming Workshop: Web3 Fundamentals',
    content: 'Join me this Friday at 6 PM for a comprehensive workshop on Web3 fundamentals. We\'ll cover blockchain basics, smart contracts, and build a simple dApp together!\n\nThis is perfect for beginners who want to understand the Web3 ecosystem.\n\nRegister using the link in the description.',
    createdAt: '3 days ago',
    likes: 38,
    comments: 9,
    space: 'Events',
    type: 'event',
    tags: ['Web3', 'Workshop', 'Blockchain'],
    accessBadge: 'free'
  },
  {
    id: '5',
    author: {
      name: 'Roberto Almeida',
      avatar: '',
    },
    title: 'LIVE TODAY: Q&A Session with Industry Experts',
    content: 'I\'ll be hosting a live Q&A session today at 7 PM with industry experts from Google, Microsoft, and Meta. We\'ll be discussing career progression in tech and answering your questions.\n\nPremium members will get priority for their questions!',
    createdAt: '5 hours ago',
    likes: 56,
    comments: 23,
    space: 'Live Streams',
    type: 'live',
    tags: ['Career', 'Q&A', 'LiveStream'],
    accessBadge: 'premium'
  },
  {
    id: '6',
    author: {
      name: 'Juliana Santos',
      avatar: '',
      role: 'Content Creator'
    },
    title: 'New Course Released: Advanced React Patterns',
    content: 'I\'m excited to announce my new course on Advanced React Patterns is now available for premium members! This course covers context API, compound components, render props, and much more.\n\nThe first module is available for free members as well. Check it out!',
    createdAt: '1 day ago',
    likes: 78,
    comments: 34,
    space: 'Courses',
    type: 'content',
    isPaid: true,
    teaser: 'I\'m excited to announce my new course on Advanced React Patterns is now available for premium members!',
    tags: ['React', 'Course', 'Development'],
    accessBadge: 'premium'
  }
];

export const useFeedData = (postsPerPage: number = 5) => {
  const [currentView, setCurrentView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeSpace, setActiveSpace] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const spaceOptions = [
    { id: 'all', name: 'All Spaces' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'general', name: 'General Discussion' },
    { id: 'free', name: 'Free Group' },
    { id: 'premium', name: 'Premium Group' },
    { id: 'mentorship', name: 'Mentorship Circle' }
  ];

  // Filter posts based on current filter settings
  const filteredPosts = samplePosts.filter(post => {
    if (activeSpace !== 'all' && post.space.toLowerCase() !== activeSpace) {
      return false;
    }
    
    if (contentFilter !== 'all') {
      if (contentFilter === 'posts' && post.type && post.type !== 'post') return false;
      if (contentFilter === 'events' && post.type !== 'event') return false;
      if (contentFilter === 'lives' && post.type !== 'live') return false;
      if (contentFilter === 'content' && post.type !== 'content') return false;
    }
    
    if (accessFilter !== 'all') {
      if (accessFilter === 'free' && post.isPaid) return false;
      if (accessFilter === 'paid' && !post.isPaid) return false;
      if (accessFilter === 'subscription' && !post.isPaid) return false;
    }
    
    if (selectedTags.length > 0) {
      if (!post.tags || !post.tags.some(tag => selectedTags.includes(tag))) {
        return false;
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(query));
      const authorMatch = post.author.name.toLowerCase().includes(query);
      
      if (!(titleMatch || contentMatch || tagMatch || authorMatch)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort posts (pinned first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    return 0;
  });
  
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, contentFilter, accessFilter, selectedTags, activeSpace]);
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setContentFilter('all');
    setAccessFilter('all');
    setSelectedTags([]);
    setActiveSpace('all');
  };
  
  const hasFilters = searchQuery !== '' || 
                     contentFilter !== 'all' || 
                     accessFilter !== 'all' || 
                     selectedTags.length > 0 ||
                     activeSpace !== 'all';

  return {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    contentFilter,
    setContentFilter,
    accessFilter,
    setAccessFilter,
    selectedTags,
    setSelectedTags,
    activeSpace,
    setActiveSpace,
    currentPage,
    setCurrentPage,
    spaceOptions,
    filteredPosts: currentPosts,
    totalPages,
    hasFilters,
    clearAllFilters,
  };
};
