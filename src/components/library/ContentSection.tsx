
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import ContentRow from './ContentRow';
import ContentGrid from './ContentGrid';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  layout?: 'row' | 'grid';
  viewAllUrl?: string;
  isTopTen?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  items, 
  onItemSelect,
  layout = 'row',
  viewAllUrl,
  isTopTen = false
}) => {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  // For top ten, limit to 10 items and add rank numbers
  const displayItems = isTopTen ? items.slice(0, 10) : items;

  return (
    <div className="mb-8 relative group">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
        
        {viewAllUrl && (
          <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View All <ChevronRight size={16} />
          </Button>
        )}
      </div>
      
      {layout === 'row' ? (
        <ContentRow 
          items={displayItems} 
          onItemSelect={onItemSelect} 
          isTopTen={isTopTen} 
        />
      ) : (
        <ContentGrid 
          items={expanded ? displayItems : displayItems.slice(0, 8)} 
          onItemSelect={onItemSelect} 
        />
      )}
      
      {layout === 'grid' && displayItems.length > 8 && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentSection;
