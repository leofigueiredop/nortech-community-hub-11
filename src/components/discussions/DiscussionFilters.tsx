import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { X, Filter, Search, Tag, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DiscussionFilter } from '@/types/discussion';

interface DiscussionFiltersProps {
  topicId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: DiscussionFilter[];
  onFilterChange: (filters: DiscussionFilter[]) => void;
}

const DiscussionFilters: React.FC<DiscussionFiltersProps> = ({
  topicId,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterChange
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  // Common tags for discussions
  const availableTags = ['beginner', 'advanced', 'question', 'guide', 'help', 'announcement', 'tutorial'];

  // Helper to check if a filter is active
  const isFilterActive = (type: string, value: string) => {
    return activeFilters.some(filter => filter.type === type && filter.value === value);
  };

  // Handle toggling a filter
  const toggleFilter = (type: string, value: string) => {
    const existingFilter = activeFilters.findIndex(f => f.type === type && f.value === value);
    
    if (existingFilter >= 0) {
      // Remove filter if it's already active
      const newFilters = [...activeFilters];
      newFilters.splice(existingFilter, 1);
      onFilterChange(newFilters);
    } else {
      // Add filter
      onFilterChange([...activeFilters, { type: type as any, value }]);
    }
  };

  // Handle removing a filter
  const removeFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    onFilterChange(newFilters);
  };

  // Handle search input submission
  const handleSearch = () => {
    onSearchChange(inputValue);
  };

  // Handle keypress in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange([]);
    onSearchChange('');
    setInputValue('');
  };

  // Helper to get filter display text
  const getFilterDisplayText = (filter: DiscussionFilter) => {
    switch (filter.type) {
      case 'tag':
        return `#${filter.value}`;
      case 'status':
        return filter.value === 'hot' ? 'Hot' : 
              filter.value === 'answered' ? 'Answered' : 
              filter.value === 'unanswered' ? 'Unanswered' : filter.value;
      case 'format':
        return filter.value === 'question' ? 'Questions' : 
              filter.value === 'announcement' ? 'Announcements' : 
              filter.value === 'discussion' ? 'Discussions' : filter.value;
      default:
        return filter.value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search discussions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-10"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Search size={18} />
          </button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Discussions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1 text-xs">
                <Tag size={12} /> Tags
              </DropdownMenuLabel>
              {availableTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={isFilterActive('tag', tag)}
                  onCheckedChange={() => toggleFilter('tag', tag)}
                >
                  #{tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1 text-xs">
                <Clock size={12} /> Status
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('status', 'hot')}
                onCheckedChange={() => toggleFilter('status', 'hot')}
              >
                Hot Discussions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('status', 'answered')}
                onCheckedChange={() => toggleFilter('status', 'answered')}
              >
                Answered Questions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('status', 'unanswered')}
                onCheckedChange={() => toggleFilter('status', 'unanswered')}
              >
                Unanswered Questions
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1 text-xs">
                <Calendar size={12} /> Format
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('format', 'question')}
                onCheckedChange={() => toggleFilter('format', 'question')}
              >
                Questions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('format', 'discussion')}
                onCheckedChange={() => toggleFilter('format', 'discussion')}
              >
                Discussions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={isFilterActive('format', 'announcement')}
                onCheckedChange={() => toggleFilter('format', 'announcement')}
              >
                Announcements
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(activeFilters.length > 0 || searchQuery) && (
          <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10">
            <X size={16} />
          </Button>
        )}
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={`${filter.type}-${filter.value}`} 
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1"
            >
              {getFilterDisplayText(filter)}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFilter(index)} 
                className="h-4 w-4 rounded-full p-0 hover:bg-secondary/80"
              >
                <X size={10} />
              </Button>
            </Badge>
          ))}
          
          {activeFilters.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscussionFilters;
