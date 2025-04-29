import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterActions, FilterState } from '@/components/feed/hooks/useFilterState';

interface ContentFiltersProps {
  filterState: FilterState;
  filterActions: FilterActions;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalItems: number;
  filteredCount: number;
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  filterState,
  filterActions,
  sortBy,
  onSortChange,
  totalItems,
  filteredCount,
}) => {
  const {
    searchQuery,
    contentFilter,
    accessFilter,
    selectedTags,
    activeSpace,
  } = filterState;

  const {
    setSearchQuery,
    setContentFilter,
    setAccessFilter,
    setSelectedTags,
    setActiveSpace,
    clearAllFilters,
  } = filterActions;

  return (
    <div className="space-y-4 p-4 bg-background rounded-lg border">
      {/* Search Input */}
      <div>
        <Input
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Content Type Filter */}
        <Select
          value={contentFilter}
          onValueChange={setContentFilter}
        >
          <option value="all">All Types</option>
          <option value="video">Videos</option>
          <option value="article">Articles</option>
          <option value="course">Courses</option>
          <option value="resource">Resources</option>
        </Select>

        {/* Access Level Filter */}
        <Select
          value={accessFilter}
          onValueChange={setAccessFilter}
        >
          <option value="all">All Access Levels</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="unlockable">Unlockable</option>
        </Select>

        {/* Sort Options */}
        <Select
          value={sortBy}
          onValueChange={onSortChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="title">Title A-Z</option>
        </Select>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Stats and Clear Button */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalItems} items
        </span>
        {(searchQuery || contentFilter !== 'all' || accessFilter !== 'all' || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}; 