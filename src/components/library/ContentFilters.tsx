
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileVideo, File, FileAudio, Link, Image, FileText } from 'lucide-react';
import { ContentFormat } from '@/types/library';
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

interface ContentFiltersProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSearchQuery: (query: string) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  formatFilter,
  tagFilter,
  accessFilter,
  searchQuery,
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSearchQuery
}) => {
  const [tagsOpen, setTagsOpen] = useState(false);
  
  const getFormatLabel = (format: string) => {
    if (format === 'all') return 'All Formats';
    return format.charAt(0).toUpperCase() + format.slice(1);
  };
  
  return (
    <div className="flex flex-col gap-4 mb-6">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
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
              
              {['video', 'pdf', 'audio', 'link', 'image', 'text'].map((format) => (
                <DropdownMenuItem 
                  key={format}
                  onClick={() => setFormatFilter(format)}
                  className={formatFilter === format ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  <ContentFormatIcon format={format} size={16} />
                  <span className="ml-2">{getFormatLabel(format)}</span>
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
                Premium
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Simple tag filter with toggle functionality */}
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          onClick={() => setTagsOpen(!tagsOpen)} 
          className="text-sm text-muted-foreground p-0 h-auto"
        >
          Tags
          <span className="ml-1 text-xs">
            {tagsOpen ? "▼" : "►"}
          </span>
        </Button>
        {tagFilter !== 'all' && (
          <Badge 
            className="ml-2 bg-purple-500 hover:bg-purple-600 cursor-pointer"
            onClick={() => setTagFilter('all')}
          >
            {tagFilter} ×
          </Badge>
        )}
      </div>
      
      {tagsOpen && (
        <div className="flex flex-wrap gap-2 mb-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={tagFilter === tag ? 'default' : 'outline'}
              onClick={() => setTagFilter(tag)}
              className={`cursor-pointer whitespace-nowrap ${tagFilter === tag ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentFilters;
