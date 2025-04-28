
import React from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentSection from './ContentSection';
import LibraryCategories from './LibraryCategories';
import { motion } from 'framer-motion';
import FeaturedContent from './FeaturedContent';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

interface LibraryContentProps {
  content: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContent: React.FC<LibraryContentProps> = ({
  content,
  onItemSelect
}) => {
  // Get top 10 content by views
  const topTenContent = [...content]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  // Get featured content (most viewed)
  const featuredContent = [topTenContent[0]].filter(Boolean);

  // Create an adapter function to handle the onItemSelect with content type
  const handleItemSelect = (item: any) => {
    // Find the original item from the content array to maintain type consistency
    const originalItem = content.find(c => c.id === item.id);
    if (originalItem) {
      onItemSelect(originalItem);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="container py-6 max-w-screen-2xl space-y-8">
        {/* Featured Content */}
        <FeaturedContent items={featuredContent} onItemSelect={onItemSelect} />

        {/* Top 10 Section */}
        <div className="space-y-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Top 10 This Week 🏆
          </motion.h2>
          
          <ContentSection 
            title="" 
            items={adaptLibraryArrayToContentType(topTenContent)} 
            onItemSelect={handleItemSelect}
            isTopTen={true}
            layout="horizontal"
          />
        </div>

        {/* Categories Navigation */}
        <div className="space-y-4">
          <motion.h2 
            className="text-2xl font-semibold text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Explore by Category
          </motion.h2>
          <LibraryCategories />
        </div>
      </div>
    </ScrollArea>
  );
};

export default LibraryContent;
