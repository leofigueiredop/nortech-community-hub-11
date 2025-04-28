
import React from 'react';
import { ContentItem } from '@/types/library';
import ContentSection from './ContentSection';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

interface LibraryContentRowsProps {
  content: ContentItem[];
  activeView: string;
  visitedTags: string[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContentRows: React.FC<LibraryContentRowsProps> = ({
  content,
  activeView,
  visitedTags,
  onItemSelect
}) => {
  // Top 10 content
  const topTenContent = [...content]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
    
  // New releases
  const newReleases = [...content]
    .sort((a, b) => new Date(b.created_at || b.createdAt || '').getTime() - new Date(a.created_at || a.createdAt || '').getTime())
    .slice(0, 10);
  
  // Content by format - refined grouping with clear labels
  const videoContent = content.filter(item => 
    item.format === 'video' || item.format === 'youtube' || item.format === 'vimeo');
  
  const pdfContent = content.filter(item => 
    item.format === 'pdf' || item.format === 'text' || item.format === 'gdoc');
  
  const audioContent = content.filter(item => 
    item.format === 'audio');
  
  const courseContent = content.filter(item => 
    item.format === 'course');
  
  const linkContent = content.filter(item => 
    item.format === 'link');
  
  // For personalized recommendations based on visited tags
  const recommendedContent = content
    .filter(item => item.tags && item.tags.some(tag => visitedTags.includes(tag)))
    .slice(0, 10);

  // Handle item selection by finding the original library item
  const handleItemSelect = (item: any) => {
    // Find the original item from content array to maintain type consistency
    const originalItem = content.find(i => i.id === item.id);
    if (originalItem) {
      onItemSelect(originalItem);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top 10 section with clean numbering */}
      {topTenContent.length > 0 && (
        <ContentSection 
          title="Top 10 This Week" 
          items={adaptLibraryArrayToContentType(topTenContent)}
          onItemSelect={handleItemSelect}
          isTopTen={true}
          viewAllUrl="/library/top"
          layout="horizontal"
        />
      )}

      {/* Recent additions - everyone wants to see what's new */}
      {newReleases.length > 0 && (
        <ContentSection 
          title="New Releases" 
          items={adaptLibraryArrayToContentType(newReleases)}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/new"
          showNewBadge={true}
          layout="grid"
        />
      )}

      {/* Content by format - most engaging first */}
      {courseContent.length > 0 && (
        <ContentSection 
          title="Courses 🔥" 
          items={adaptLibraryArrayToContentType(courseContent.slice(0, 20))}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/courses"
          layout="grid"
        />
      )}
      
      {videoContent.length > 0 && (
        <ContentSection 
          title="Videos 🎥" 
          items={adaptLibraryArrayToContentType(videoContent.slice(0, 20))}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/videos"
          layout="grid"
        />
      )}
      
      {pdfContent.length > 0 && (
        <ContentSection 
          title="Documents & PDFs 📘" 
          items={adaptLibraryArrayToContentType(pdfContent.slice(0, 20))}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/pdfs"
          layout="grid"
        />
      )}
      
      {audioContent.length > 0 && (
        <ContentSection 
          title="Audio Content 🎧" 
          items={adaptLibraryArrayToContentType(audioContent.slice(0, 20))}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/audio"
          layout="grid"
        />
      )}
      
      {linkContent.length > 0 && (
        <ContentSection 
          title="Links & Resources 🔗" 
          items={adaptLibraryArrayToContentType(linkContent.slice(0, 20))}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/links"
          layout="grid"
        />
      )}
      
      {/* Personalized recommendations - always a winner */}
      {recommendedContent.length > 3 && (
        <ContentSection 
          title="Recommended For You" 
          items={adaptLibraryArrayToContentType(recommendedContent)}
          onItemSelect={handleItemSelect}
          viewAllUrl="/library/recommended"
          layout="grid"
        />
      )}
    </div>
  );
};

export default LibraryContentRows;
