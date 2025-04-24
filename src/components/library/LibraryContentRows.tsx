
import React from 'react';
import { ContentItem } from '@/types/library';
import ContentSection from './ContentSection';

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
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
    
  // New releases
  const newReleases = [...content]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  
  // Content by format
  const videoContent = content.filter(item => item.format === 'video' || item.format === 'youtube' || item.format === 'vimeo');
  const pdfContent = content.filter(item => item.format === 'pdf' || item.format === 'text' || item.format === 'gdoc');
  const audioContent = content.filter(item => item.format === 'audio');
  const courseContent = content.filter(item => item.format === 'course');
  const linkContent = content.filter(item => item.format === 'link');
  
  // For users with premium view
  const isPremiumView = activeView === 'premium' || activeView === 'premiumPlus';
  
  // Personalized recommendations (based on visited tags)
  const recommendedContent = content.filter(item => 
    item.tags.some(tag => visitedTags.includes(tag))
  ).slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Top 10 section */}
      <ContentSection 
        title="Top 10 This Week" 
        items={topTenContent} 
        onItemSelect={onItemSelect}
        isTopTen={true}
        viewAllUrl="/library/top"
      />

      {/* Recent additions */}
      <ContentSection 
        title="New Releases" 
        items={newReleases} 
        onItemSelect={onItemSelect}
        viewAllUrl="/library/new"
      />

      {/* Content by format */}
      {courseContent.length > 0 && (
        <ContentSection 
          title="Courses 🔥" 
          items={courseContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/courses"
        />
      )}
      
      {videoContent.length > 0 && (
        <ContentSection 
          title="Videos 🎥" 
          items={videoContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/videos"
        />
      )}
      
      {pdfContent.length > 0 && (
        <ContentSection 
          title="PDFs 📘" 
          items={pdfContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/pdfs"
        />
      )}
      
      {audioContent.length > 0 && (
        <ContentSection 
          title="Audio Series 🎧" 
          items={audioContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/audio"
        />
      )}
      
      {linkContent.length > 0 && (
        <ContentSection 
          title="Links & Resources 🔗" 
          items={linkContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/links"
        />
      )}
      
      {/* Personalized recommendations */}
      {recommendedContent.length > 0 && (
        <ContentSection 
          title="Recommended For You" 
          items={recommendedContent} 
          onItemSelect={onItemSelect}
          viewAllUrl="/library/recommended"
        />
      )}
    </div>
  );
};

export default LibraryContentRows;
