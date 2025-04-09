
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
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
    'Mentoring', 'Career', 'Productivity', 'AI', 'Tech'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <Badge 
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"} 
            className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-nortech-purple hover:bg-nortech-purple/90' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FeedFilters;
