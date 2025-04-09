
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Search, Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface FeedFiltersProps {
  contentFilter: string;
  setContentFilter: (filter: string) => void;
  accessFilter: string;
  setAccessFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
  contentFilter,
  setContentFilter,
  accessFilter,
  setAccessFilter,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery
}) => {
  const contentTypes = [
    { id: 'all', name: 'All' },
    { id: 'posts', name: 'Posts only' },
    { id: 'events', name: 'Events' },
    { id: 'lives', name: 'Lives' },
    { id: 'content', name: 'New content' }
  ];

  const accessTypes = [
    { id: 'all', name: 'All content' },
    { id: 'free', name: 'Free content' },
    { id: 'paid', name: 'Paid content' },
    { id: 'subscription', name: 'My subscription only' }
  ];

  const availableTags = [
    'Web3', 'Finance', 'Design', 'Development', 'Marketing', 
    'Mentoring', 'Career', 'Productivity', 'AI', 'Tech', 'Crypto',
    'Web', 'Mobile', 'Backend', 'Frontend', 'Blockchain', 'NFT',
    'Security', 'DevOps', 'Cloud', 'Leadership', 'Mindset'
  ];

  // Sort tags by popularity (in a real app this would be from analytics)
  const popularTags = [...availableTags].sort(() => 0.5 - Math.random()).slice(0, 6);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(`#${tag}`);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search posts, tags or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Content Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {contentTypes.map(type => (
                <DropdownMenuItem 
                  key={type.id}
                  onClick={() => setContentFilter(type.id)}
                  className={contentFilter === type.id ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  {type.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuLabel className="mt-2">Access Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {accessTypes.map(type => (
                <DropdownMenuItem 
                  key={type.id}
                  onClick={() => setAccessFilter(type.id)}
                  className={accessFilter === type.id ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  {type.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Popular tags section */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Tag size={16} className="mr-2 text-purple-500" />
            <span className="text-sm font-medium">Trending Topics</span>
          </div>
          <Link 
            to="/tags" 
            className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View all
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {popularTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"} 
              className={`cursor-pointer ${
                selectedTags.includes(tag) 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300'
              }`}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </Badge>
          ))}
          <Link to="/tags">
            <Badge 
              variant="outline"
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300"
            >
              More...
            </Badge>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center mb-2">
        <Tag size={16} className="mr-2 text-purple-500" />
        <span className="text-sm font-medium">Filter by Tags</span>
      </div>
      
      <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-md border">
        {availableTags.map(tag => (
          <Badge 
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"} 
            className={`cursor-pointer ${
              selectedTags.includes(tag) 
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300'
            }`}
            onClick={() => toggleTag(tag)}
          >
            <Link to={`/tags/${tag}`} className="mr-1" onClick={(e) => e.stopPropagation()}>
              #
            </Link>
            {tag}
          </Badge>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Active Filters:</span>
          {selectedTags.map(tag => (
            <Badge 
              key={tag}
              variant="default" 
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer flex items-center gap-1"
            >
              <Link to={`/tags/${tag}`} className="mr-1" onClick={(e) => e.stopPropagation()}>
                #
              </Link>
              {tag}
              <button onClick={() => toggleTag(tag)} className="ml-1">
                <X size={14} />
              </button>
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedTags([])}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedFilters;
