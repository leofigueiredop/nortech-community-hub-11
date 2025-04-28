
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

interface FilterOption {
  id: string;
  name: string;
  value: string;
}

interface DiscussionFiltersProps {
  topicOptions: FilterOption[];
  formatOptions: FilterOption[];
  tagOptions: FilterOption[];
  statusOptions: FilterOption[];
  selectedFilters: {
    search: string;
    topics: string[];
    formats: string[];
    tags: string[];
    statuses: string[];
  };
  onFilterChange: (filterType: string, value: string | string[]) => void;
  onClearFilters: () => void;
}

export function DiscussionFilters({
  topicOptions,
  formatOptions,
  tagOptions,
  statusOptions,
  selectedFilters,
  onFilterChange,
  onClearFilters
}: DiscussionFiltersProps) {
  const [searchValue, setSearchValue] = useState(selectedFilters.search || '');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange('search', searchValue);
  };
  
  const handleCheckboxChange = (filterType: string, value: string) => {
    let currentValues = selectedFilters[filterType as keyof typeof selectedFilters] as string[] || [];
    
    // If the value is already selected, remove it, otherwise add it
    if (currentValues.includes(value)) {
      currentValues = currentValues.filter(v => v !== value);
    } else {
      currentValues = [...currentValues, value];
    }
    
    onFilterChange(filterType, currentValues);
  };
  
  // Count total active filters
  const activeFilterCount = (
    selectedFilters.topics.length +
    selectedFilters.formats.length +
    selectedFilters.tags.length +
    selectedFilters.statuses.length +
    (selectedFilters.search ? 1 : 0)
  );
  
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
        {activeFilterCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Active Filters</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-7 text-xs"
              >
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedFilters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {selectedFilters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange('search', '')}
                  />
                </Badge>
              )}
              
              {selectedFilters.topics.map(topic => {
                const topicName = topicOptions.find(t => t.value === topic)?.name || topic;
                return (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                    <Layers className="h-3 w-3" /> {topicName}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCheckboxChange('topics', topic)}
                    />
                  </Badge>
                );
              })}
              
              {selectedFilters.formats.map(format => {
                const formatName = formatOptions.find(f => f.value === format)?.name || format;
                return (
                  <Badge key={format} variant="secondary" className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {formatName}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCheckboxChange('formats', format)}
                    />
                  </Badge>
                );
              })}
              
              {selectedFilters.tags.map(tag => {
                const tagName = tagOptions.find(t => t.value === tag)?.name || tag;
                return (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {tagName}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCheckboxChange('tags', tag)}
                    />
                  </Badge>
                );
              })}
              
              {selectedFilters.statuses.map(status => {
                const statusName = statusOptions.find(s => s.value === status)?.name || status;
                return (
                  <Badge key={status} variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {statusName}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCheckboxChange('statuses', status)}
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
          {/* Topics Filter */}
          <AccordionItem value="topics" className="border rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Topics</span>
                {selectedFilters.topics.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedFilters.topics.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {topicOptions.map(topic => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`topic-${topic.id}`}
                      checked={selectedFilters.topics.includes(topic.value)}
                      onCheckedChange={() => handleCheckboxChange('topics', topic.value)}
                    />
                    <Label
                      htmlFor={`topic-${topic.id}`}
                      className="text-sm cursor-pointer flex-grow"
                    >
                      {topic.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Format Filter */}
          <AccordionItem value="formats" className="border rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sm hover:bg-accent hover:no-underline">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Format</span>
                {selectedFilters.formats.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedFilters.formats.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {formatOptions.map(format => (
                  <div key={format.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`format-${format.id}`}
                      checked={selectedFilters.formats.includes(format.value)}
                      onCheckedChange={() => handleCheckboxChange('formats', format.value)}
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
                {selectedFilters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedFilters.tags.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {tagOptions.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag.id}`}
                      checked={selectedFilters.tags.includes(tag.value)}
                      onCheckedChange={() => handleCheckboxChange('tags', tag.value)}
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
                {selectedFilters.statuses.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedFilters.statuses.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`status-${status.id}`}
                      checked={selectedFilters.statuses.includes(status.value)}
                      onCheckedChange={() => handleCheckboxChange('statuses', status.value)}
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
