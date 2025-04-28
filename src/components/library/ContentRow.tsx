
import React from 'react';
import { ContentItem } from '@/types/library';
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
  // Use the ContentSection component which now handles all the layout and animations
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
