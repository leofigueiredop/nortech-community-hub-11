
import React from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentSection from './ContentSection';
import LibraryCategories from './LibraryCategories';
import { motion } from 'framer-motion';

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
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="container py-6 max-w-screen-2xl space-y-8">
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
            items={topTenContent} 
            onItemSelect={onItemSelect}
            isTopTen={true}
            layout="grid"
          />
        </div>

        {/* Categories Navigation */}
        <LibraryCategories content={content} onItemSelect={onItemSelect} />
      </div>
    </ScrollArea>
  );
};

export default LibraryContent;
