
import React from 'react';
import { ContentItem as ContentLibraryItem } from '@/types/library';
import { ContentItem } from '@/types/content';
import ContentSection from './ContentSection';

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
  // Create adapter function to convert ContentLibraryItem to ContentItem
  const adaptItems = (items: ContentLibraryItem[]): ContentItem[] => {
    return items.map(item => ({
      ...item,
      format: item.format as any, // Cast format to solve the type mismatch
      description: item.description || "",
      access_level: item.accessLevel || item.access_level || "free",
      community_id: item.community_id || "default-community",
      created_at: item.created_at || item.createdAt || new Date().toISOString(),
      updated_at: item.updated_at || item.updatedAt || new Date().toISOString()
    }));
  };

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
      items={adaptItems(items)}
      onItemSelect={handleItemSelect}
      isTopTen={isTopTen}
    />
  );
};

export default ContentRow;
