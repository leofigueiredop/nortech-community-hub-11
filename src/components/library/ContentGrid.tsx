
import React from 'react';
import { ContentItem } from '@/types/library';
import EnhancedContentCard from './EnhancedContentCard';

interface ContentGridProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, onItemSelect }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <h3 className="text-lg font-medium mb-2">No content matches your filters</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <EnhancedContentCard
          key={item.id}
          item={item}
          onClick={() => onItemSelect(item)}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
