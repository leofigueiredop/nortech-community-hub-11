
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
  ThumbsUp,
  X
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
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

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
  
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Video className="h-4 w-4" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="h-4 w-4" />;
      case 'audio':
        return <FileAudio className="h-4 w-4" />;
      case 'link':
        return <Link2 className="h-4 w-4" />;
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ContentFormatIcon format={format} size={16} />;
    }
  };
  
  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'newest':
        return <Clock className="h-4 w-4" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommended':
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pt-2 pb-4 border-b mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-4">
          {/* Top row with search and filter toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="search"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            <Button 
              variant={isFiltersOpen ? "default" : "outline"}
              size="sm"
              className="gap-2 md:hidden"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter size={16} />
              <span>Filters</span>
              {isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              <Select defaultValue={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
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
          </div>

          {/* Desktop filters - always visible */}
          <div className="hidden md:block">
            <div className="flex flex-wrap items-center gap-3">
              {/* Format filter chips in a row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant={formatFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer h-8 px-3"
                  onClick={() => setFormatFilter('all')}
                >
                  All Types
                </Badge>
                {['video', 'pdf', 'audio', 'link', 'course'].map((format) => (
                  <Badge 
                    key={format}
                    variant={formatFilter === format ? 'default' : 'outline'} 
                    className={`cursor-pointer h-8 px-3 flex items-center gap-1.5 ${
                      formatFilter === format ? 'bg-primary' : 'hover:bg-accent'
                    }`}
                    onClick={() => setFormatFilter(format)}
                  >
                    {getFormatIcon(format)}
                    <span>{format.charAt(0).toUpperCase() + format.slice(1)}</span>
                  </Badge>
                ))}
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Access level filters */}
              <div className="flex items-center gap-2">
                <Badge 
                  variant={accessFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer h-8 px-3"
                  onClick={() => setAccessFilter('all')}
                >
                  All Access
                </Badge>
                <Badge 
                  variant={accessFilter === 'free' ? 'default' : 'outline'} 
                  className={`cursor-pointer h-8 px-3 ${
                    accessFilter === 'free' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-200'
                  }`}
                  onClick={() => setAccessFilter('free')}
                >
                  Free
                </Badge>
                <Badge 
                  variant={accessFilter === 'premium' ? 'default' : 'outline'} 
                  className={`cursor-pointer h-8 px-3 flex items-center gap-1.5 ${
                    accessFilter === 'premium' ? 'bg-amber-500 hover:bg-amber-600' : 'hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-200'
                  }`}
                  onClick={() => setAccessFilter('premium')}
                >
                  <Crown className="h-3.5 w-3.5" />
                  Premium
                </Badge>
                <Badge 
                  variant={accessFilter === 'unlockable' ? 'default' : 'outline'} 
                  className={`cursor-pointer h-8 px-3 ${
                    accessFilter === 'unlockable' ? 'bg-purple-500 hover:bg-purple-600' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-800 dark:hover:text-purple-200'
                  }`}
                  onClick={() => setAccessFilter('unlockable')}
                >
                  Unlockable
                </Badge>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Tags dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Tag size={14} className="mr-2" />
                    Tags
                    {selectedTags.length > 0 && (
                      <span className="ml-1.5 bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-[300px] overflow-auto">
                  <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedTags.map((tag) => (
                        <Badge 
                          key={tag}
                          className="bg-primary cursor-pointer"
                          onClick={() => handleTagSelect(tag)}
                        >
                          #{tag} <X className="ml-1" size={12} />
                        </Badge>
                      ))}
                      {selectedTags.length > 0 && (
                        <Badge 
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer"
                          onClick={clearTags}
                        >
                          Clear all
                        </Badge>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          onClick={() => handleTagSelect(tag)}
                          className={`cursor-pointer whitespace-nowrap ${
                            selectedTags.includes(tag) 
                              ? 'bg-primary hover:bg-primary/90' 
                              : 'hover:bg-accent border-primary/20'
                          }`}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile filters collapsible panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-3 space-y-5">
                  {/* Format filter chips */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Content Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={formatFilter === 'all' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setFormatFilter('all')}
                      >
                        All Types
                      </Badge>
                      {['video', 'pdf', 'audio', 'link', 'course'].map((format) => (
                        <Badge 
                          key={format}
                          variant={formatFilter === format ? 'default' : 'outline'} 
                          className={`cursor-pointer flex items-center gap-1.5 ${
                            formatFilter === format ? 'bg-primary' : 'hover:bg-accent'
                          }`}
                          onClick={() => setFormatFilter(format)}
                        >
                          {getFormatIcon(format)}
                          <span>{format.charAt(0).toUpperCase() + format.slice(1)}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Access level filters */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Access Level</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={accessFilter === 'all' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setAccessFilter('all')}
                      >
                        All Access
                      </Badge>
                      <Badge 
                        variant={accessFilter === 'free' ? 'default' : 'outline'} 
                        className={`cursor-pointer ${
                          accessFilter === 'free' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-200'
                        }`}
                        onClick={() => setAccessFilter('free')}
                      >
                        Free
                      </Badge>
                      <Badge 
                        variant={accessFilter === 'premium' ? 'default' : 'outline'} 
                        className={`cursor-pointer flex items-center gap-1.5 ${
                          accessFilter === 'premium' ? 'bg-amber-500 hover:bg-amber-600' : 'hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-200'
                        }`}
                        onClick={() => setAccessFilter('premium')}
                      >
                        <Crown className="h-3.5 w-3.5" />
                        Premium
                      </Badge>
                      <Badge 
                        variant={accessFilter === 'unlockable' ? 'default' : 'outline'} 
                        className={`cursor-pointer ${
                          accessFilter === 'unlockable' ? 'bg-purple-500 hover:bg-purple-600' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-800 dark:hover:text-purple-200'
                        }`}
                        onClick={() => setAccessFilter('unlockable')}
                      >
                        Unlockable
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Sort dropdown - mobile only */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Sort By</h3>
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
                  
                  <Separator />
                  
                  {/* Tag filter section with collapsible functionality */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setTagsOpen(!tagsOpen)} 
                        className="h-6 px-2"
                      >
                        {tagsOpen ? "Hide" : "Show"} 
                        {tagsOpen ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                      </Button>
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedTags.map((tag) => (
                          <Badge 
                            key={tag}
                            className="bg-primary cursor-pointer"
                            onClick={() => handleTagSelect(tag)}
                          >
                            #{tag} <X className="ml-1" size={12} />
                          </Badge>
                        ))}
                        <Badge 
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer"
                          onClick={clearTags}
                        >
                          Clear
                        </Badge>
                      </div>
                    )}
                    
                    <Collapsible open={tagsOpen}>
                      <CollapsibleContent className="space-y-2">
                        <div className="flex flex-wrap gap-1.5 p-2 bg-accent/30 rounded-md">
                          {allTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                              onClick={() => handleTagSelect(tag)}
                              className={`cursor-pointer whitespace-nowrap ${
                                selectedTags.includes(tag) 
                                  ? 'bg-primary hover:bg-primary/90' 
                                  : 'hover:bg-accent border-primary/20'
                              }`}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContentFilters;
