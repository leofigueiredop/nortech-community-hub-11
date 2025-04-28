
import React from 'react';
import { ContentItem } from '@/types/library';
import ContentRow from './ContentRow';

interface LibraryContentRowsProps {
  featuredContent: ContentItem[];
  newContent: ContentItem[];
  popularContent: ContentItem[];
  recommendedContent: ContentItem[];
  trendingContent: ContentItem[];
  premiumContent: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContentRows: React.FC<LibraryContentRowsProps> = ({
  featuredContent,
  newContent,
  popularContent,
  recommendedContent,
  trendingContent,
  premiumContent,
  onItemSelect
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Featured Content */}
      {featuredContent.length > 0 && (
        <ContentRow 
          title="Featured Content" 
          items={featuredContent}
          onItemSelect={onItemSelect}
        />
      )}

      {/* New Content */}
      {newContent.length > 0 && (
        <ContentRow 
          title="New Content" 
          items={newContent}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Popular Content */}
      {popularContent.length > 0 && (
        <ContentRow 
          title="Popular Content" 
          items={popularContent}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Recommended Content */}
      {recommendedContent.length > 0 && (
        <ContentRow 
          title="Recommended For You" 
          items={recommendedContent}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Top 10 Content */}
      {trendingContent.length > 0 && (
        <ContentRow 
          title="Trending Now" 
          items={trendingContent}
          onItemSelect={onItemSelect}
          isTopTen={true}
        />
      )}

      {/* Premium Content */}
      {premiumContent.length > 0 && (
        <ContentRow 
          title="Premium Content" 
          items={premiumContent}
          onItemSelect={onItemSelect}
        />
      )}
    </div>
  );
};

export default LibraryContentRows;
