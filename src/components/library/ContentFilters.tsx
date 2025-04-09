
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileVideo, File, FileAudio, Link, Image, FileText } from 'lucide-react';
import { ContentFormat } from '@/types/library';

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
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'video':
        return <FileVideo size={16} />;
      case 'pdf':
        return <File size={16} />;
      case 'audio':
        return <FileAudio size={16} />;
      case 'link':
        return <Link size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'text':
        return <FileText size={16} />;
      default:
        return <Filter size={16} />;
    }
  };
  
  const getFormatLabel = (format: string) => {
    if (format === 'all') return 'All Formats';
    return format.charAt(0).toUpperCase() + format.slice(1);
  };
  
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center">
        <Search className="h-5 w-5 mr-2 text-slate-400" />
        <Input
          type="search"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
      </div>
      
      {/* Format Filters - Inspired by the image */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        <Button
          variant={formatFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setFormatFilter('all')}
          className={`${formatFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full min-w-24`}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Formats
        </Button>
        
        {['video', 'pdf', 'audio', 'link', 'image', 'text'].map((format) => (
          <Button
            key={format}
            variant={formatFilter === format ? 'default' : 'outline'}
            onClick={() => setFormatFilter(format)}
            className={`${formatFilter === format ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full min-w-24 whitespace-nowrap`}
          >
            {getFormatIcon(format)}
            <span className="ml-2">{getFormatLabel(format)}</span>
          </Button>
        ))}
      </div>
      
      {/* Tags Filter */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 flex-wrap">
        <Button
          variant={tagFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setTagFilter('all')}
          className={`${tagFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full`}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Tags
        </Button>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={tagFilter === tag ? 'default' : 'outline'}
            onClick={() => setTagFilter(tag)}
            className={`cursor-pointer whitespace-nowrap px-3 py-1 rounded-full ${tagFilter === tag ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      {/* Access Level Filter */}
      <div className="flex items-center gap-2 py-2">
        <Button
          variant={accessFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('all')}
          className={`${accessFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full`}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Access
        </Button>
        <Button
          variant={accessFilter === 'free' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('free')}
          className={`${accessFilter === 'free' ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full`}
        >
          Free
        </Button>
        <Button
          variant={accessFilter === 'premium' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('premium')}
          className={`${accessFilter === 'premium' ? 'bg-purple-500 hover:bg-purple-600' : ''} rounded-full`}
        >
          Premium
        </Button>
      </div>
    </div>
  );
};

export default ContentFilters;
