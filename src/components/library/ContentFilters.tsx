
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Tag, 
  ChevronDown, 
  ChevronUp,
  Video,
  FileText, 
  FileAudio,
  Link2,
  BookOpen,
  Crown,
  Clock,
  TrendingUp,
  ThumbsUp
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContentFormatIcon } from './management/utils/ContentFormatIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentFiltersProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  sortBy?: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy?: (sort: string) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  formatFilter,
  tagFilter,
  accessFilter,
  searchQuery,
  sortBy = 'newest',
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSearchQuery,
  setSortBy = () => {},
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([tagFilter !== 'all' ? tagFilter : ''].filter(Boolean));
  const [tagsOpen, setTagsOpen] = useState(false);
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      const newTags = selectedTags.filter(t => t !== tag);
      setSelectedTags(newTags);
      
      // If all tags were removed, reset to 'all'
      if (newTags.length === 0) {
        setTagFilter('all');
      } else {
        // For simplicity, we're just setting the last selected tag
        setTagFilter(newTags[newTags.length - 1]);
      }
    } else {
      // Add tag
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setTagFilter(tag);
    }
  };
  
  const clearTags = () => {
    setSelectedTags([]);
    setTagFilter('all');
  };
  
  const getFormatLabel = (format: string) => {
    if (format === 'all') return 'All Formats';
    return format.charAt(0).toUpperCase() + format.slice(1);
  };
  
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'pdf':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 mr-2" />;
      case 'link':
        return <Link2 className="h-4 w-4 mr-2" />;
      case 'course':
        return <BookOpen className="h-4 w-4 mr-2" />;
      default:
        return <ContentFormatIcon format={format} size={16} />;
    }
  };
  
  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'newest':
        return <Clock className="h-4 w-4 mr-2" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'recommended':
        return <ThumbsUp className="h-4 w-4 mr-2" />;
      default:
        return <Clock className="h-4 w-4 mr-2" />;
    }
  };
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="sticky top-0 z-20 bg-background pt-2 pb-4 border-b mb-6">
      <div className="flex flex-col gap-4">
        {/* Top row with search and filter toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 md:hidden"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter size={16} />
            <span>Filters</span>
            {isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hidden md:flex">
                <Filter size={16} />
                <span>Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Content Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => setFormatFilter('all')}
                  className={formatFilter === 'all' ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All Formats
                </DropdownMenuItem>
                
                {['video', 'pdf', 'audio', 'link', 'course'].map((format) => (
                  <DropdownMenuItem 
                    key={format}
                    onClick={() => setFormatFilter(format)}
                    className={formatFilter === format ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    {getFormatIcon(format)}
                    <span>{getFormatLabel(format)}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuLabel className="mt-3">Access Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => setAccessFilter('all')}
                  className={accessFilter === 'all' ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All Access
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setAccessFilter('free')}
                  className={accessFilter === 'free' ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  Free
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setAccessFilter('premium')}
                  className={accessFilter === 'premium' ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Premium
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setAccessFilter('unlockable')}
                  className={accessFilter === 'unlockable' ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Unlockable
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort dropdown */}
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] hidden md:inline-flex">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Newest</span>
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Most Viewed</span>
                </div>
              </SelectItem>
              <SelectItem value="recommended">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span>Recommended</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Collapsible filters section for mobile */}
        <Collapsible open={isFiltersOpen || !isMobile} onOpenChange={setIsFiltersOpen} className="md:block">
          <CollapsibleContent>
            {/* Format filter chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant={formatFilter === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setFormatFilter('all')}
              >
                All Types
              </Badge>
              {['video', 'pdf', 'audio', 'link', 'course'].map((format) => (
                <Badge 
                  key={format}
                  variant={formatFilter === format ? 'default' : 'outline'} 
                  className={`cursor-pointer flex items-center ${
                    formatFilter === format ? 'bg-primary' : 'hover:bg-primary/20'
                  }`}
                  onClick={() => setFormatFilter(format)}
                >
                  {getFormatIcon(format)}
                  {getFormatLabel(format)}
                </Badge>
              ))}
            </div>
            
            {/* Access level filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant={accessFilter === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setAccessFilter('all')}
              >
                All Access
              </Badge>
              <Badge 
                variant={accessFilter === 'free' ? 'default' : 'outline'} 
                className={`cursor-pointer ${
                  accessFilter === 'free' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-800 dark:hover:text-green-200'
                }`}
                onClick={() => setAccessFilter('free')}
              >
                Free
              </Badge>
              <Badge 
                variant={accessFilter === 'premium' ? 'default' : 'outline'} 
                className={`cursor-pointer flex items-center ${
                  accessFilter === 'premium' ? 'bg-amber-500 hover:bg-amber-600' : 'hover:bg-amber-100 dark:hover:bg-amber-900 hover:text-amber-800 dark:hover:text-amber-200'
                }`}
                onClick={() => setAccessFilter('premium')}
              >
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
              <Badge 
                variant={accessFilter === 'unlockable' ? 'default' : 'outline'} 
                className={`cursor-pointer ${
                  accessFilter === 'unlockable' ? 'bg-purple-500 hover:bg-purple-600' : 'hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-200'
                }`}
                onClick={() => setAccessFilter('unlockable')}
              >
                Unlockable
              </Badge>
            </div>
            
            {/* Sort dropdown - mobile only */}
            <div className="mb-4 md:hidden">
              <Select defaultValue={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Newest</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Most Viewed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="recommended">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      <span>Recommended</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tag filter section with toggle functionality */}
            <div className="mb-2">
              <Button 
                variant="ghost" 
                onClick={() => setTagsOpen(!tagsOpen)} 
                className="text-sm text-muted-foreground p-0 h-auto flex items-center"
              >
                <Tag size={16} className="mr-2 text-purple-500" />
                <span>Tags</span>
                <span className="ml-1 text-xs">
                  {tagsOpen ? "▼" : "►"}
                </span>
                
                {selectedTags.length > 0 && (
                  <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    {selectedTags.length} selected
                  </span>
                )}
              </Button>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTags.map((tag) => (
                    <Badge 
                      key={tag}
                      className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                  <Badge 
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
                    onClick={clearTags}
                  >
                    Clear all
                  </Badge>
                </div>
              )}
            </div>
            
            {tagsOpen && (
              <div className="flex flex-wrap gap-2 mb-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-md border">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    onClick={() => handleTagSelect(tag)}
                    className={`cursor-pointer whitespace-nowrap ${
                      selectedTags.includes(tag) 
                        ? 'bg-purple-500 hover:bg-purple-600' 
                        : 'hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300'
                    }`}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ContentFilters;
