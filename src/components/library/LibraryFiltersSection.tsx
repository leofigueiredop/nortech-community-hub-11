import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Video, 
  BookOpen, 
  Grid, 
  ListFilter, 
  Mic, 
  ChevronDown, 
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LibraryFiltersSectionProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  sortBy: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSortBy: (sort: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  showFilters?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const LibraryFiltersSection: React.FC<LibraryFiltersSectionProps> = ({
  formatFilter,
  tagFilter,
  accessFilter,
  sortBy,
  allFormats = [],
  allTags = [],
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSortBy,
  onClearFilters,
  hasActiveFilters
}) => {
  // Format icons mapping
  const formatIcons: Record<string, React.ReactNode> = {
    all: <Grid className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    article: <FileText className="h-4 w-4" />,
    course: <BookOpen className="h-4 w-4" />,
    podcast: <Mic className="h-4 w-4" />,
  };
  
  // Access level labels and classes
  const accessLevels = [
    { value: 'all', label: 'All Access' },
    { value: 'free', label: 'Free', className: 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' },
    { value: 'premium', label: 'Premium', className: 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100' },
    { value: 'unlockable', label: 'Unlockable', className: 'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100' },
  ];
  
  // Sort options with icons
  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: <Clock className="h-4 w-4 mr-2" /> },
    { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { value: 'upcoming', label: 'Upcoming', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: 'featured', label: 'Featured', icon: <Sparkles className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="container py-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Format filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium mr-1">Format:</span>
          <Button
            variant={formatFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="h-8"
            onClick={() => setFormatFilter('all')}
          >
            <Grid className="h-4 w-4 mr-2" />
            All
          </Button>
          
          {allFormats && allFormats.map(format => (
            <Button
              key={format}
              variant={formatFilter === format ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => setFormatFilter(format)}
            >
              {formatIcons[format.toLowerCase()] || <FileText className="h-4 w-4 mr-2" />}
              {format.charAt(0).toUpperCase() + format.slice(1)}
            </Button>
          ))}
        </div>
        
        {/* Access level filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium mr-1">Access:</span>
          {accessLevels.map(level => (
            <Badge
              key={level.value}
              variant={accessFilter === level.value ? 'default' : 'outline'}
              className={`cursor-pointer px-2 py-1 ${
                accessFilter === level.value ? '' : level.className
              }`}
              onClick={() => setAccessFilter(level.value)}
            >
              {level.label}
            </Badge>
          ))}
        </div>
        
        {/* Tag filters - simplified for most common tags */}
        {allTags && allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium mr-1">Tags:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {tagFilter ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                      {tagFilter}
                    </>
                  ) : (
                    <>
                      <ListFilter className="h-3.5 w-3.5 mr-2" />
                      Select Tag
                    </>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                <DropdownMenuRadioGroup value={tagFilter} onValueChange={setTagFilter}>
                  <DropdownMenuRadioItem value="">All Tags</DropdownMenuRadioItem>
                  {allTags.map(tag => (
                    <DropdownMenuRadioItem key={tag} value={tag}>
                      {tag}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Sort options */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium mr-1">Sort:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {sortOptions.find(option => option.value === sortBy)?.icon}
                {sortOptions.find(option => option.value === sortBy)?.label || 'Sort'}
                <ChevronDown className="h-3.5 w-3.5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                {sortOptions.map(option => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default LibraryFiltersSection;
