
import React, { useState } from 'react';
import { 
  Bookmark, 
  CheckCircle, 
  ChevronDown, 
  Filter, 
  Tag, 
  User, 
  Layers, 
  MessageCircle, 
  X 
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { DiscussionFilter } from '@/types/discussion';

interface FilterOption {
  id: string;
  name: string;
  value: string;
}

interface DiscussionFiltersProps {
  topicId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: DiscussionFilter[]) => void;
  activeFilters: DiscussionFilter[];
  topicOptions?: FilterOption[];
  formatOptions?: FilterOption[];
  tagOptions?: FilterOption[];
  statusOptions?: FilterOption[];
}

export function DiscussionFilters({
  topicId,
  searchQuery,
  onSearchChange,
  onFilterChange,
  activeFilters,
  topicOptions = [],
  formatOptions = [],
  tagOptions = [],
  statusOptions = []
}: DiscussionFiltersProps) {
  const [searchValue, setSearchValue] = useState(searchQuery || '');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchValue);
  };
  
  const handleFilterToggle = (filter: DiscussionFilter) => {
    // Check if filter is already active
    const filterIndex = activeFilters.findIndex(
      f => f.type === filter.type && f.value === filter.value
    );
    
    let newFilters = [...activeFilters];
    if (filterIndex >= 0) {
      // Remove filter if already active
      newFilters.splice(filterIndex, 1);
    } else {
      // Add filter if not active
      newFilters.push(filter);
    }
    
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    onFilterChange([]);
    onSearchChange('');
    setSearchValue('');
  };
  
  const defaultFormatOptions = [
    { id: 'question', name: 'Questions', value: 'question' },
    { id: 'discussion', name: 'Discussions', value: 'discussion' },
    { id: 'announcement', name: 'Announcements', value: 'announcement' }
  ];
  
  const defaultStatusOptions = [
    { id: 'hot', name: 'Hot Topics', value: 'hot' },
    { id: 'answered', name: 'Answered', value: 'answered' },
    { id: 'unanswered', name: 'Unanswered', value: 'unanswered' },
    { id: 'today', name: 'Today', value: 'today' },
    { id: 'week', name: 'This Week', value: 'week' }
  ];
  
  const defaultTagOptions = [
    { id: 'beginner', name: 'Beginner', value: 'beginner' },
    { id: 'intermediate', name: 'Intermediate', value: 'intermediate' },
    { id: 'advanced', name: 'Advanced', value: 'advanced' },
    { id: 'help', name: 'Help Needed', value: 'help' },
    { id: 'solved', name: 'Solved', value: 'solved' }
  ];
  
  const finalFormatOptions = formatOptions.length > 0 ? formatOptions : defaultFormatOptions;
  const finalStatusOptions = statusOptions.length > 0 ? statusOptions : defaultStatusOptions;
  const finalTagOptions = tagOptions.length > 0 ? tagOptions : defaultTagOptions;
  
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {/* Search and Filter Header */}
      <div className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input 
            placeholder="Search discussions..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            variant="secondary"
            size="icon"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </form>
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Active Filters</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => {
                const getIcon = () => {
                  switch (filter.type) {
                    case 'tag': return <Tag className="h-3 w-3" />;
                    case 'format': return <MessageCircle className="h-3 w-3" />;
                    case 'topic': return <Layers className="h-3 w-3" />;
                    case 'status': return <CheckCircle className="h-3 w-3" />;
                    default: return null;
                  }
                };
                
                return (
                  <Badge key={`${filter.type}-${filter.value}-${index}`} variant="secondary" className="flex items-center gap-1">
                    {getIcon()}
                    {filter.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterToggle(filter)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Filter Options */}
      <div className="p-4">
        <Accordion type="multiple" className="space-y-2">
          {/* Format Filter */}
          <AccordionItem value="formats" className="border rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Format</span>
                {activeFilters.filter(f => f.type === 'format').length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeFilters.filter(f => f.type === 'format').length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {finalFormatOptions.map(format => (
                  <div key={format.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`format-${format.id}`}
                      checked={activeFilters.some(f => f.type === 'format' && f.value === format.value)}
                      onCheckedChange={() => handleFilterToggle({
                        id: format.id,
                        type: 'format',
                        value: format.value,
                        label: format.name
                      })}
                    />
                    <Label
                      htmlFor={`format-${format.id}`}
                      className="text-sm cursor-pointer flex-grow"
                    >
                      {format.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Tags Filter */}
          <AccordionItem value="tags" className="border rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>Tags</span>
                {activeFilters.filter(f => f.type === 'tag').length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeFilters.filter(f => f.type === 'tag').length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {finalTagOptions.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag.id}`}
                      checked={activeFilters.some(f => f.type === 'tag' && f.value === tag.value)}
                      onCheckedChange={() => handleFilterToggle({
                        id: tag.id,
                        type: 'tag',
                        value: tag.value,
                        label: tag.name
                      })}
                    />
                    <Label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm cursor-pointer flex-grow"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Status Filter */}
          <AccordionItem value="statuses" className="border rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Status</span>
                {activeFilters.filter(f => f.type === 'status').length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeFilters.filter(f => f.type === 'status').length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {finalStatusOptions.map(status => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`status-${status.id}`}
                      checked={activeFilters.some(f => f.type === 'status' && f.value === status.value)}
                      onCheckedChange={() => handleFilterToggle({
                        id: status.id,
                        type: 'status',
                        value: status.value,
                        label: status.name
                      })}
                    />
                    <Label
                      htmlFor={`status-${status.id}`}
                      className="text-sm cursor-pointer flex-grow"
                    >
                      {status.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Adding a default export for the component
export default DiscussionFilters;
