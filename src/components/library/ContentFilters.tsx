
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Tag, 
  Video,
  FileText, 
  FileAudio,
  Link2,
  BookOpen,
  Crown,
  Clock,
  X
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video size={18} />;
      case 'pdf':
        return <FileText size={18} />;
      case 'audio':
        return <FileAudio size={18} />;
      case 'link':
        return <Link2 size={18} />;
      case 'course':
        return <BookOpen size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="sticky top-16 z-20 bg-background pt-4 pb-4 border-b shadow-sm">
      <div className="container max-w-screen-2xl">
        <div className="flex flex-col gap-4">
          {/* Search row */}
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
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Newest</span>
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <span>Most Viewed</span>
                  </div>
                </SelectItem>
                <SelectItem value="recommended">
                  <div className="flex items-center gap-2">
                    <span>Recommended</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format and access filters */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={formatFilter === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5"
                onClick={() => setFormatFilter('all')}
              >
                All Types
              </Badge>
              <Badge 
                variant={formatFilter === 'video' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setFormatFilter('video')}
              >
                <Video size={16} />
                <span>Video</span>
              </Badge>
              <Badge 
                variant={formatFilter === 'pdf' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setFormatFilter('pdf')}
              >
                <FileText size={16} />
                <span>PDF</span>
              </Badge>
              <Badge 
                variant={formatFilter === 'audio' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setFormatFilter('audio')}
              >
                <FileAudio size={16} />
                <span>Audio</span>
              </Badge>
              <Badge 
                variant={formatFilter === 'link' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setFormatFilter('link')}
              >
                <Link2 size={16} />
                <span>Link</span>
              </Badge>
              <Badge 
                variant={formatFilter === 'course' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setFormatFilter('course')}
              >
                <BookOpen size={16} />
                <span>Course</span>
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={accessFilter === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5"
                onClick={() => setAccessFilter('all')}
              >
                All Access
              </Badge>
              <Badge 
                variant={accessFilter === 'free' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5"
                onClick={() => setAccessFilter('free')}
              >
                Free
              </Badge>
              <Badge 
                variant={accessFilter === 'premium' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5 flex items-center gap-1.5"
                onClick={() => setAccessFilter('premium')}
              >
                <Crown size={16} />
                <span>Premium</span>
              </Badge>
              <Badge 
                variant={accessFilter === 'unlockable' ? 'default' : 'outline'} 
                className="cursor-pointer rounded-full px-4 py-1.5"
                onClick={() => setAccessFilter('unlockable')}
              >
                Unlockable
              </Badge>
            </div>
          </div>

          {/* Tags filter */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer rounded-full px-3 py-1 flex items-center gap-1"
            >
              <Tag size={14} />
              <span>Tags</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentFilters;
