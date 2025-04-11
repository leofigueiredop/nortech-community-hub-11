
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedContentCard from './EnhancedContentCard';
import ContentSection from './ContentSection';

interface ContentRowProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  isTopTen?: boolean;
  title: string;
}

const ContentRow: React.FC<ContentRowProps> = ({ 
  items, 
  onItemSelect, 
  isTopTen = false,
  title 
}) => {
  // Now using the ContentSection component which handles all the layout and animations
  return (
    <ContentSection
      title={title}
      items={items}
      onItemSelect={onItemSelect}
      isTopTen={isTopTen}
    />
  );
};

export default ContentRow;
