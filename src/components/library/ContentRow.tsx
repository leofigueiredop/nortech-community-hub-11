
import React from 'react';
import { ContentItem as ContentLibraryItem } from '@/types/library';
import { ContentItem } from '@/types/content';
import ContentSection from './ContentSection';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

interface ContentRowProps {
  items: ContentLibraryItem[];
  onItemSelect: (item: ContentLibraryItem) => void;
  isTopTen?: boolean;
  title: string;
}

const ContentRow: React.FC<ContentRowProps> = ({ 
  items, 
  onItemSelect, 
  isTopTen = false,
  title 
}) => {
  // Handle item selection by finding the original library item
  const handleItemSelect = (item: ContentItem) => {
    // Find the original item to maintain type consistency
    const originalItem = items.find(i => i.id === item.id);
    if (originalItem) {
      onItemSelect(originalItem);
    }
  };

  // Use the ContentSection component with adapted items
  return (
    <ContentSection
      title={title}
      items={adaptLibraryArrayToContentType(items)}
      onItemSelect={handleItemSelect}
      isTopTen={isTopTen}
    />
  );
};

export default ContentRow;
