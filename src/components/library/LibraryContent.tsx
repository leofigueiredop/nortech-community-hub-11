
import React from 'react';
import { ContentItem } from '@/types/library';
import ContentSection from './ContentSection';
import FeaturedContentCarousel from './FeaturedContentCarousel';
import PremiumContentUpgrade from '@/components/feed/PremiumContentUpgrade';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LibraryContentProps {
  content: ContentItem[];
  filteredContent: ContentItem[];
  featuredContent: ContentItem[];
  hasFilters: boolean;
  visitedTags: string[];
  setSelectedItem: (item: ContentItem | null) => void;
}

const LibraryContent: React.FC<LibraryContentProps> = ({
  content,
  filteredContent,
  featuredContent,
  hasFilters,
  visitedTags,
  setSelectedItem
}) => {
  // Organize content into sections
  const newReleases = [...content]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  
  const mostPopular = [...content]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  const courseContent = content.filter(item => item.format === 'course');
  
  const pdfContent = content.filter(item => item.format === 'pdf' || item.format === 'text' || item.format === 'gdoc');
  
  const audioContent = content.filter(item => item.format === 'audio');
  
  // Personalized recommendations (based on visited tags)
  const recommendedContent = content.filter(item => 
    item.tags.some(tag => visitedTags.includes(tag))
  ).slice(0, 10);

  // Premium content showcase
  const premiumContent = content.filter(item => item.accessLevel === 'premium');
  
  // Top 10 trending content
  const topTenContent = [...content]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      {/* Hero Featured Content */}
      {featuredContent.length > 0 && !hasFilters && (
        <FeaturedContentCarousel 
          items={featuredContent}
          onItemSelect={setSelectedItem}
        />
      )}

      {/* Content Sections */}
      {!hasFilters && (
        <>
          <ContentSection 
            title="Top 10 Trending" 
            items={topTenContent} 
            onItemSelect={setSelectedItem}
            isTopTen={true}
          />
        
          <ContentSection 
            title="New Releases" 
            items={newReleases} 
            onItemSelect={setSelectedItem}
            viewAllUrl="/library/new"
          />

          <ContentSection 
            title="Most Popular" 
            items={mostPopular} 
            onItemSelect={setSelectedItem}
            viewAllUrl="/library/popular"
          />

          {recommendedContent.length > 0 && (
            <ContentSection 
              title="Recommended for You" 
              items={recommendedContent} 
              onItemSelect={setSelectedItem}
              viewAllUrl="/library/recommended"
            />
          )}

          {courseContent.length > 0 && (
            <ContentSection 
              title="Courses & Masterclasses" 
              items={courseContent} 
              onItemSelect={setSelectedItem}
              viewAllUrl="/library/courses"
            />
          )}

          {pdfContent.length > 0 && (
            <ContentSection 
              title="PDF Guides" 
              items={pdfContent} 
              onItemSelect={setSelectedItem}
              viewAllUrl="/library/pdfs"
            />
          )}

          {audioContent.length > 0 && (
            <ContentSection 
              title="Audio Series" 
              items={audioContent} 
              onItemSelect={setSelectedItem}
              viewAllUrl="/library/audio"
            />
          )}

          {premiumContent.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Premium Content</h2>
              <PremiumContentUpgrade />
            </div>
          )}
        </>
      )}

      {/* Display filtered content when filters are applied */}
      {hasFilters && (
        <ContentSection 
          title={`Search Results (${filteredContent.length})`}
          items={filteredContent} 
          onItemSelect={setSelectedItem}
          layout="grid"
        />
      )}
    </ScrollArea>
  );
};

export default LibraryContent;
