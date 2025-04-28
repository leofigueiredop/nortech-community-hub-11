
import React from 'react';
import { ContentItem } from '@/types/library';
import ContentRow from './ContentRow';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

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
  // Helper function to convert ContentItem[] to ContentTypeItem[]
  const convertContentItems = (items: ContentItem[]) => {
    return adaptLibraryArrayToContentType(items);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Featured Content */}
      {featuredContent.length > 0 && (
        <ContentRow 
          title="Featured Content" 
          items={convertContentItems(featuredContent)}
          onItemSelect={onItemSelect}
        />
      )}

      {/* New Content */}
      {newContent.length > 0 && (
        <ContentRow 
          title="New Content" 
          items={convertContentItems(newContent)}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Popular Content */}
      {popularContent.length > 0 && (
        <ContentRow 
          title="Popular Content" 
          items={convertContentItems(popularContent)}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Recommended Content */}
      {recommendedContent.length > 0 && (
        <ContentRow 
          title="Recommended For You" 
          items={convertContentItems(recommendedContent)}
          onItemSelect={onItemSelect}
        />
      )}

      {/* Top 10 Content */}
      {trendingContent.length > 0 && (
        <ContentRow 
          title="Trending Now" 
          items={convertContentItems(trendingContent)}
          onItemSelect={onItemSelect}
          isTopTen={true}
        />
      )}

      {/* Premium Content */}
      {premiumContent.length > 0 && (
        <ContentRow 
          title="Premium Content" 
          items={convertContentItems(premiumContent)}
          onItemSelect={onItemSelect}
        />
      )}
    </div>
  );
};

export default LibraryContentRows;
