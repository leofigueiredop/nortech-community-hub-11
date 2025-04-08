
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Settings, Moon, Palette, Keyboard, Eye, UserPlus, PlusCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Post, { PostProps } from '@/components/post/Post';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Sample post data
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
    isAnnouncement: true
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
    space: 'General Discussion'
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
    space: 'Premium Group'
  }
];

const Feed: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [posts, setPosts] = useState(samplePosts);
  const [activeSpace, setActiveSpace] = useState('all');

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // In a real app, filter posts based on the selected view
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
    // In a real app, filter posts based on the selected space
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
        {/* Left sidebar - Spaces */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 font-medium border-b border-gray-200 dark:border-gray-700">
              Spaces
            </div>
            <div className="p-2">
              {spaceOptions.map(space => (
                <Button
                  key={space.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${activeSpace === space.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  onClick={() => handleSpaceChange(space.id)}
                >
                  {space.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main feed */}
        <div className="md:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {activeSpace === 'all' ? 'All Posts' : 
               spaceOptions.find(s => s.id === activeSpace)?.name}
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>

          {posts.length > 0 ? (
            posts.map(post => (
              <Post key={post.id} {...post} />
            ))
          ) : (
            <div className="bg-nortech-light-purple rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-nortech-dark-blue">
                Welcome to your community
              </h2>
              <p className="text-lg text-nortech-text-muted mb-8">
                Your feed is where you'll see new posts
              </p>
              <Button 
                onClick={() => setCreatePostOpen(true)}
                className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
              >
                <PlusCircle size={18} />
                Create post
              </Button>
            </div>
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
