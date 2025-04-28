
import React from 'react';
import { ContentItem } from '@/types/library';
import LibraryContentRows from './LibraryContentRows';
import LibraryCategories from './LibraryCategories';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

interface LibraryContentProps {
  content: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

interface LibraryCategoriesProps {
  content: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContent: React.FC<LibraryContentProps> = ({ content, onItemSelect }) => {
  // Filter content by different criteria
  const featuredContent = content.filter(item => item.is_featured || item.featured);
  const newContent = content.filter(item => item.isNew);
  const popularContent = [...content].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);
  const recommendedContent = content.slice(0, 8); // Mock recommendation logic
  
  // Get trending content (using views or other metrics)
  const trendingContent = [...content]
    .sort((a, b) => {
      const aValue = a.views || 0;
      const bValue = b.views || 0;
      return bValue - aValue;
    })
    .slice(0, 10);
  
  // Get premium content
  const premiumContent = content.filter(
    item => (item.access_level || item.accessLevel) === 'premium' || (item.access_level || item.accessLevel) === 'premium_plus'
  );
  
  return (
    <div className="container py-6 max-w-screen-2xl space-y-10">
      <LibraryContentRows 
        featuredContent={featuredContent}
        newContent={newContent}
        popularContent={popularContent}
        recommendedContent={recommendedContent} 
        trendingContent={trendingContent}
        premiumContent={premiumContent}
        onItemSelect={onItemSelect}
      />

      {/* Library categories section */}
      <LibraryCategories 
        content={content} 
        onItemSelect={onItemSelect} 
      />
    </div>
  );
};

export default LibraryContent;
