
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import ContentRow from './ContentRow';
import ContentGrid from './ContentGrid';

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  layout?: 'row' | 'grid';
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  items, 
  onItemSelect,
  layout = 'row'
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      
      {layout === 'row' ? (
        <ContentRow items={items} onItemSelect={onItemSelect} />
      ) : (
        <ContentGrid items={items} onItemSelect={onItemSelect} />
      )}
    </div>
  );
};

export default ContentSection;
