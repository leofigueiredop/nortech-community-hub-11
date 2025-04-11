import React from 'react';
import { ContentItem, ContentFormat } from '@/types/library';
import ContentSection from './ContentSection';

interface LibraryContentRowsProps {
  content: ContentItem[];
  activeView: 'all' | 'free' | 'premium' | 'unlockable';
  visitedTags: string[];
  onItemSelect: (item: ContentItem | null) => void;
}

const LibraryContentRows: React.FC<LibraryContentRowsProps> = ({
  content,
  activeView,
  visitedTags,
  onItemSelect
}) => {
  // Apply main filter based on active view
  const viewFilteredContent = content.filter(item => {
    if (activeView === 'all') return true;
    if (activeView === 'free') return item.accessLevel === 'free';
    if (activeView === 'premium') return item.accessLevel === 'premium';
    if (activeView === 'unlockable') return item.pointsEnabled;
    return true;
  });

  // Organize content into sections
  const newReleases = [...viewFilteredContent]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);
  
  const mostPopular = [...viewFilteredContent]
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);
  
  // Videos
  const videoContent = viewFilteredContent.filter(
    item => item.format === 'video' || item.format === 'youtube' || item.format === 'vimeo'
  ).slice(0, 12);
  
  // PDFs
  const pdfContent = viewFilteredContent.filter(
    item => item.format === 'pdf' || item.format === 'text' || item.format === 'gdoc'
  ).slice(0, 12);
  
  // Audio
  const audioContent = viewFilteredContent.filter(
    item => item.format === 'audio'
  ).slice(0, 12);
  
  // Courses
  const courseContent = viewFilteredContent.filter(
    item => item.format === 'course'
  ).slice(0, 12);
  
  // Personalized recommendations (based on visited tags)
  const recommendedContent = viewFilteredContent.filter(item => 
    item.tags.some(tag => visitedTags.includes(tag))
  ).slice(0, 12);

  // Premium showcase (only show in 'all' or 'premium' views)
  const premiumShowcase = activeView === 'all' || activeView === 'premium' 
    ? viewFilteredContent.filter(item => item.accessLevel === 'premium').slice(0, 12)
    : [];
  
  // Top trending
  const topTrending = [...viewFilteredContent]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Check if we have any content to display
  const hasContent = viewFilteredContent.length > 0;

  // Check if sections have content to show
  const hasSections = 
    newReleases.length > 0 || 
    mostPopular.length > 0 || 
    videoContent.length > 0 || 
    pdfContent.length > 0 || 
    audioContent.length > 0 || 
    courseContent.length > 0 || 
    recommendedContent.length > 0 || 
    premiumShowcase.length > 0;

  if (!hasContent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No content available</h2>
        <p className="text-muted-foreground">
          There's no content available for the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Top trending row (always first when in 'all' view) */}
      {activeView === 'all' && topTrending.length > 0 && (
        <ContentSection 
          title="Top Trending" 
          items={topTrending} 
          onItemSelect={onItemSelect}
          isTopTen={true}
        />
      )}
      
      {/* Recommended content (personalized, if any) */}
      {recommendedContent.length > 0 && (
        <ContentSection 
          title="Recommended For You" 
          items={recommendedContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/recommended"
        />
      )}
      
      {/* New releases */}
      {newReleases.length > 0 && (
        <ContentSection 
          title="New Releases" 
          items={newReleases} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/new"
        />
      )}
      
      {/* Premium content showcase (only in all or premium views) */}
      {(activeView === 'all' || activeView === 'premium') && premiumShowcase.length > 0 && (
        <ContentSection 
          title="Premium Content" 
          items={premiumShowcase} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/premium"
        />
      )}
      
      {/* Format-specific sections */}
      {videoContent.length > 0 && (
        <ContentSection 
          title="Videos" 
          items={videoContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/videos"
        />
      )}
      
      {courseContent.length > 0 && (
        <ContentSection 
          title="Courses" 
          items={courseContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/courses"
        />
      )}
      
      {pdfContent.length > 0 && (
        <ContentSection 
          title="PDF Guides & Documents" 
          items={pdfContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/documents"
        />
      )}
      
      {audioContent.length > 0 && (
        <ContentSection 
          title="Audio Content" 
          items={audioContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/audio"
        />
      )}
      
      {/* Most popular (if not already showing trending) */}
      {activeView !== 'all' && mostPopular.length > 0 && (
        <ContentSection 
          title="Most Popular" 
          items={mostPopular} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/popular"
        />
      )}
      
      {!hasSections && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No content matches the current view settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryContentRows;
