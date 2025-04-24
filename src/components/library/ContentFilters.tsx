
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentFiltersProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  sortBy: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  formatFilter,
  tagFilter,
  accessFilter,
  searchQuery,
  sortBy,
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSearchQuery,
  setSortBy
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };
  
  const resetFilters = () => {
    setFormatFilter('all');
    setTagFilter('all');
    setAccessFilter('all');
    setSortBy('newest');
  };
  
  const hasActiveFilters = formatFilter !== 'all' || tagFilter !== 'all' || accessFilter !== 'all';

  const formatLabels: Record<string, string> = {
    video: "Videos 🎥",
    audio: "Audio 🎧",
    pdf: "PDFs 📄",
    text: "Documents 📝",
    course: "Courses 📚",
    link: "Links 🔗",
    youtube: "YouTube 📺",
    vimeo: "Vimeo 🎬",
    gdoc: "Google Docs 📋",
    image: "Images 🖼️",
  };
  
  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-b">
      <div className="container max-w-screen-2xl py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          {/* Search */}
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content library..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 bg-background"
            />
            {localSearch && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
              >
                &times;
              </Button>
            )}
          </form>
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Format filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={formatFilter !== 'all' ? "secondary" : "outline"} 
                  size="sm" 
                  className="gap-1.5 whitespace-nowrap"
                >
                  <Filter size={16} />
                  <span>Format</span>
                  {formatFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                      {formatFilter}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="space-y-2">
                  <h4 className="font-medium mb-2">Content Format</h4>
                  <ScrollArea className="h-60">
                    <div className="space-y-1 pr-3">
                      <Button 
                        variant={formatFilter === 'all' ? "secondary" : "ghost"} 
                        size="sm" 
                        className="w-full justify-start" 
                        onClick={() => setFormatFilter('all')}
                      >
                        All Formats
                      </Button>
                      {allFormats.map((format) => (
                        <Button
                          key={format}
                          variant={formatFilter === format ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setFormatFilter(format)}
                        >
                          {formatLabels[format] || format}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Access filter */}
            <Select 
              value={accessFilter} 
              onValueChange={setAccessFilter}
            >
              <SelectTrigger className="h-9 w-[160px] bg-background">
                <SelectValue placeholder="Access Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="free">Free Content</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
                <SelectItem value="unlockable">Unlockable</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Tags filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={tagFilter !== 'all' ? "secondary" : "outline"} 
                  size="sm" 
                  className="gap-1.5 whitespace-nowrap"
                >
                  <Tag size={16} />
                  <span>Tags</span>
                  {tagFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                      {tagFilter}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="space-y-2">
                  <h4 className="font-medium mb-2">Filter by Tag</h4>
                  <ScrollArea className="h-60">
                    <div className="space-y-1 pr-3">
                      <Button 
                        variant={tagFilter === 'all' ? "secondary" : "ghost"} 
                        size="sm" 
                        className="w-full justify-start" 
                        onClick={() => setTagFilter('all')}
                      >
                        All Tags
                      </Button>
                      {allTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={tagFilter === tag ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setTagFilter(tag)}
                        >
                          <span className="truncate">{tag}</span>
                          {/* Could add count here */}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Sort by */}
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="h-9 w-[130px] md:w-[160px] bg-background">
                <SlidersHorizontal size={16} className="mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Reset button */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="whitespace-nowrap"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentFilters;
