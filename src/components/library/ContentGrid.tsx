
import React from 'react';
import { ContentItem } from '@/types/library';
import EnhancedContentCard from './EnhancedContentCard';
import { motion } from 'framer-motion';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

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

  // Netflix-style staggered animation for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Handle item selection by finding the original library item
  const handleItemSelect = (item: any) => {
    onItemSelect(items.find(i => i.id === item.id) || item);
  };

  // Convert library items to content items for EnhancedContentCard
  const adaptedItems = adaptLibraryArrayToContentType(items);

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {adaptedItems.map((contentItem, index) => (
        <motion.div key={contentItem.id} variants={item}>
          <EnhancedContentCard
            item={contentItem}
            onSelect={() => handleItemSelect(contentItem)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContentGrid;
