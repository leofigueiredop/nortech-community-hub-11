
import React from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import LibraryContentRows from '@/components/library/LibraryContentRows';
import FeaturedContentCarousel from '@/components/library/FeaturedContentCarousel';
import { motion } from 'framer-motion';
import EnhancedContentCard from './EnhancedContentCard';

interface LibraryContentAreaProps {
  isSearchActive: boolean;
  filteredContent: ContentItem[];
  searchQuery: string;
  activeView: 'all' | 'free' | 'premium' | 'unlockable';
  featuredContent: ContentItem[];
  content: ContentItem[];
  visitedTags: string[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContentArea: React.FC<LibraryContentAreaProps> = ({
  isSearchActive,
  filteredContent,
  searchQuery,
  activeView,
  featuredContent,
  content,
  visitedTags,
  onItemSelect
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="container py-6 max-w-screen-2xl space-y-8">
        {/* Hero Feature Carousel - only show on main view, not during search */}
        {featuredContent.length > 0 && !isSearchActive && activeView === 'all' && (
          <FeaturedContentCarousel 
            items={featuredContent}
            onItemSelect={onItemSelect}
          />
        )}

        {/* Search Results */}
        {isSearchActive ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Search Results: {filteredContent.length} items
            </h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredContent.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                  <EnhancedContentCard item={item} onClick={() => onItemSelect(item)} />
                </motion.div>
              ))}
            </motion.div>
            {filteredContent.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </motion.div>
            )}
          </div>
        ) : (
          /* Netflix-style content rows when not searching */
          <LibraryContentRows 
            content={content}
            activeView={activeView}
            visitedTags={visitedTags}
            onItemSelect={onItemSelect}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default LibraryContentArea;
