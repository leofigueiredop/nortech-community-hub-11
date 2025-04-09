
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentFormat, AccessLevel } from '@/types/library';

interface ContentFiltersProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  allFormats: ContentFormat[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (access: string) => void;
  setSearchQuery: (query: string) => void;
}

const formatLabels: Record<ContentFormat, string> = {
  'video': 'Videos',
  'pdf': 'PDFs',
  'link': 'Links',
  'audio': 'Audio',
  'image': 'Images',
  'text': 'Text'
};

const accessLabels: Record<AccessLevel, string> = {
  'free': 'Free',
  'premium': 'Premium'
};

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
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="w-full sm:w-auto">
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {allFormats.map((format) => (
                <SelectItem key={format} value={format}>
                  {formatLabels[format]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={accessFilter} onValueChange={setAccessFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access</SelectItem>
              <SelectItem value="free">{accessLabels.free}</SelectItem>
              <SelectItem value="premium">{accessLabels.premium}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setFormatFilter('all');
            setTagFilter('all');
            setAccessFilter('all');
            setSearchQuery('');
          }}
          className="ml-auto"
        >
          <Filter className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ContentFilters;
