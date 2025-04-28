
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiscussionFilter } from '@/types/discussion';

interface DiscussionFiltersProps {
  topicId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: DiscussionFilter[]) => void;
  activeFilters: DiscussionFilter[];
}

const DiscussionFilters = ({
  topicId,
  searchQuery,
  onSearchChange,
  onFilterChange,
  activeFilters
}: DiscussionFiltersProps) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  
  // Update component if prop changes
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);
  
  // Handle search change
  const handleSearch = () => {
    onSearchChange(searchValue);
  };
  
  // Handle search with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Add filter
  const addFilter = (filter: DiscussionFilter) => {
    // Check if filter already exists
    const exists = activeFilters.some(
      f => f.type === filter.type && f.value === filter.value
    );
    
    if (!exists) {
      onFilterChange([...activeFilters, filter]);
    }
  };
  
  // Remove filter
  const removeFilter = (filter: DiscussionFilter) => {
    onFilterChange(
      activeFilters.filter(
        f => !(f.type === filter.type && f.value === filter.value)
      )
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    onFilterChange([]);
    onSearchChange('');
  };
  
  // Only add topic filter if a specific topic is selected
  useEffect(() => {
    if (topicId && activeFilters.every(f => f.type !== 'topic')) {
      addFilter({
        type: 'topic' as 'tag' | 'status' | 'time' | 'format' | 'topic',
        value: topicId,
      });
    }
  }, [topicId]);
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map((filter, index) => {
            // Don't show the topic filter badge
            if (filter.type === 'topic') return null;
            
            let label = filter.label || filter.value;
            
            // Format filter labels for better display
            if (filter.type === 'status') {
              if (filter.value === 'hot') label = '🔥 Hot';
              if (filter.value === 'answered') label = '✅ Answered';
              if (filter.value === 'unanswered') label = '❓ Unanswered';
            }
            
            if (filter.type === 'time') {
              if (filter.value === 'today') label = '📅 Today';
              if (filter.value === 'week') label = '📅 This week';
              if (filter.value === 'month') label = '📅 This month';
            }
            
            return (
              <Badge 
                key={`${filter.type}-${filter.value}-${index}`}
                variant="secondary"
                className="px-2 py-1 cursor-pointer"
                onClick={() => removeFilter(filter)}
              >
                {label} &times;
              </Badge>
            );
          })}
          {activeFilters.some(f => f.type !== 'topic') && (
            <Button 
              variant="ghost" 
              className="h-7 text-xs" 
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {/* Status Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'status', 
                value: 'hot', 
                label: 'Hot discussions',
                id: 'hot'
              })
            }>
              🔥 Hot discussions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'status', 
                value: 'answered',
                label: 'Answered questions',
                id: 'answered'
              })
            }>
              ✅ Answered questions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'status', 
                value: 'unanswered',
                label: 'Unanswered questions',
                id: 'unanswered'
              })
            }>
              ❓ Unanswered questions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Time Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Time</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'time', 
                value: 'today',
                label: 'Today',
                id: 'today'
              })
            }>
              📅 Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'time', 
                value: 'week',
                label: 'This week',
                id: 'week'
              })
            }>
              📅 This week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'time', 
                value: 'month',
                label: 'This month',
                id: 'month' 
              })
            }>
              📅 This month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Format Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Format</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'format', 
                value: 'question',
                label: 'Questions',
                id: 'question'
              })
            }>
              ❓ Questions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'format', 
                value: 'discussion',
                label: 'Discussions',
                id: 'discussion'
              })
            }>
              💬 Discussions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => 
              addFilter({ 
                type: 'format', 
                value: 'announcement',
                label: 'Announcements',
                id: 'announcement'
              })
            }>
              📢 Announcements
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Common tags - this would be dynamic based on popular tags */}
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="react" onClick={() => 
              addFilter({ type: 'tag', value: 'React', label: 'React' })
            }>
              React
            </TabsTrigger>
            <TabsTrigger value="typescript" onClick={() => 
              addFilter({ type: 'tag', value: 'TypeScript', label: 'TypeScript' })
            }>
              TypeScript
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DiscussionFilters;
