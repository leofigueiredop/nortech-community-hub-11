import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, FileVideo, FileAudio, Link as LinkIcon, FileImage, Youtube, Video, LayoutGrid } from 'lucide-react';
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
  const formatIcons: Record<ContentFormat, React.ReactNode> = {
    video: <FileVideo size={16} />,
    pdf: <FileText size={16} />,
    link: <LinkIcon size={16} />,
    audio: <FileAudio size={16} />,
    image: <FileImage size={16} />,
    text: <FileText size={16} />,
    youtube: <Youtube size={16} />,
    vimeo: <Video size={16} />,
    gdoc: <FileText size={16} />,
    gdrive: <LayoutGrid size={16} />
  };
  
  return (
    <div className="flex flex-col gap-4">
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
      
      <div className="flex items-center gap-2 overflow-x-auto">
        <Button
          variant={formatFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setFormatFilter('all')}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Formats
        </Button>
        {allFormats.map((format) => (
          <Button
            key={format}
            variant={formatFilter === format ? 'default' : 'outline'}
            onClick={() => setFormatFilter(format)}
            className="whitespace-nowrap"
          >
            {formatIcons[format as ContentFormat]}
            {format.charAt(0).toUpperCase() + format.slice(1)}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto">
        <Button
          variant={tagFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setTagFilter('all')}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Tags
        </Button>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={tagFilter === tag ? 'default' : 'outline'}
            onClick={() => setTagFilter(tag)}
            className="cursor-pointer whitespace-nowrap"
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={accessFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('all')}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Access
        </Button>
        <Button
          variant={accessFilter === 'free' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('free')}
        >
          Free
        </Button>
        <Button
          variant={accessFilter === 'premium' ? 'default' : 'outline'}
          onClick={() => setAccessFilter('premium')}
        >
          Premium
        </Button>
      </div>
    </div>
  );
};

export default ContentFilters;
