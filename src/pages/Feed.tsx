import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Settings, Moon, Palette, Keyboard, Eye, UserPlus, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Post, { PostProps } from '@/components/post/Post';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FeedFilters from '@/components/feed/FeedFilters';
import SpacesSidebar from '@/components/feed/SpacesSidebar';
import EmptyFeed from '@/components/feed/EmptyFeed';
import FeedPagination from '@/components/feed/FeedPagination';

const SettingsPopover: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-white">
          <span className="font-semibold">Pablo's Community</span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
        <div className="p-0">
          <div className="flex flex-col">
            <Link 
              to="/settings/general" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/theme" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Moon size={20} />
              <span className="text-sm font-medium">Switch to light mode</span>
            </Link>
            
            <Link 
              to="/settings/customize" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Palette size={20} />
              <span className="text-sm font-medium">Customize theme</span>
            </Link>
            
            <Link 
              to="/settings/shortcuts" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Keyboard size={20} />
              <span className="text-sm font-medium">Keyboard shortcuts</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/view-as" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Eye size={20} />
              <span className="text-sm font-medium">View as</span>
            </Link>
            
            <Link 
              to="/settings/invite" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">Invite member</span>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
    tags: ['Welcome', 'Community']
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
    tags: ['Course', 'Feedback']
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
    tags: ['Resources', 'Projects']
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
    tags: ['Web3', 'Workshop', 'Blockchain']
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
    tags: ['Career', 'Q&A', 'LiveStream']
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
    tags: ['React', 'Course', 'Development']
  }
];

const Feed: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeSpace, setActiveSpace] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const spaceOptions = [
    { id: 'all', name: 'All Spaces' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'general', name: 'General Discussion' },
    { id: 'free', name: 'Free Group' },
    { id: 'premium', name: 'Premium Group' },
    { id: 'mentorship', name: 'Mentorship Circle' }
  ];

  const handleSpaceChange = (space: string) => {
    setActiveSpace(space);
  };

  return (
    <MainLayout title="Feed">
      <div className="flex justify-between items-center mb-6">
        <SettingsPopover />
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-gray-700 text-gray-200 flex items-center gap-2">
                <Eye size={16} />
                {currentView === 'all' ? 'View All' : 
                 currentView === 'free' ? 'View as Free Member' : 
                 currentView === 'premium' ? 'View as Premium Member' : 
                 'View as Mentor'}
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
              <DropdownMenuItem onClick={() => handleViewChange('all')} className="hover:bg-gray-700">
                View All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('free')} className="hover:bg-gray-700">
                View as Free Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('premium')} className="hover:bg-gray-700">
                View as Premium Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('mentor')} className="hover:bg-gray-700">
                View as Mentor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={() => setCreatePostOpen(true)}
            className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
          >
            <PlusCircle size={18} />
            Create post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SpacesSidebar 
            spaces={spaceOptions} 
            activeSpace={activeSpace} 
            onSpaceChange={handleSpaceChange} 
          />
        </div>

        <div className="md:col-span-2">
          <FeedFilters 
            contentFilter={contentFilter}
            setContentFilter={setContentFilter}
            accessFilter={accessFilter}
            setAccessFilter={setAccessFilter}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {sortedPosts.length > 0 ? (
            <>
              {currentPosts.map(post => (
                <Post key={post.id} {...post} />
              ))}
              
              {totalPages > 1 && (
                <FeedPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EmptyFeed 
              hasFilters={hasFilters} 
              onClearFilters={clearAllFilters} 
            />
          )}
        </div>
      </div>

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </MainLayout>
  );
};

export default Feed;
