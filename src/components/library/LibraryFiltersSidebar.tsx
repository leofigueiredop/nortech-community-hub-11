
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingUp, ThumbsUp, Video, FileText, FileAudio, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ContentFormatIcon } from './management/utils/ContentFormatIcon';

interface LibraryFiltersSidebarProps {
  formatFilter: string;
  tagFilter: string;
  sortBy: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setSortBy: (sort: string) => void;
  onClose: () => void;
}

const LibraryFiltersSidebar: React.FC<LibraryFiltersSidebarProps> = ({
  formatFilter,
  tagFilter,
  sortBy,
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setSortBy,
  onClose
}) => {
  const handleClearFilters = () => {
    setFormatFilter('all');
    setTagFilter('all');
    setSortBy('newest');
    onClose();
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Video className="h-4 w-4 mr-2" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 mr-2" />;
      case 'course':
        return <BookOpen className="h-4 w-4 mr-2" />;
      default:
        return <ContentFormatIcon format={format} size={16} className="mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h4 className="text-sm font-medium mb-3">Sort By</h4>
        <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Newest
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="popular" id="popular" />
            <Label htmlFor="popular" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Most Viewed
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recommended" id="recommended" />
            <Label htmlFor="recommended" className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Recommended
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Content Format Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Content Format</h4>
        <div className="space-y-2">
          <Badge 
            variant={formatFilter === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer mr-2 mb-2"
            onClick={() => setFormatFilter('all')}
          >
            All Formats
          </Badge>
          {['video', 'pdf', 'audio', 'course', ...allFormats.filter(f => 
            !['video', 'pdf', 'audio', 'course'].includes(f)
          )].map((format) => (
            <Badge 
              key={format}
              variant={formatFilter === format ? 'default' : 'outline'} 
              className="cursor-pointer mr-2 mb-2 flex items-center"
              onClick={() => setFormatFilter(format)}
            >
              {getFormatIcon(format)}
              {format.charAt(0).toUpperCase() + format.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Tags</h4>
        <ScrollArea className="h-[200px] pr-4">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={tagFilter === 'all' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setTagFilter('all')}
            >
              All Tags
            </Badge>
            {allTags.map((tag) => (
              <Badge 
                key={tag}
                variant={tagFilter === tag ? 'default' : 'outline'} 
                className="cursor-pointer"
                onClick={() => setTagFilter(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
        <Button onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default LibraryFiltersSidebar;
