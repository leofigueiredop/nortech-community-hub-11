
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import ContentViewer from '@/components/library/ContentViewer';
import TagSuggestions from '@/components/tags/TagSuggestions';
import TagsExplorer from '@/components/tags/TagsExplorer';
import FeaturedContent from '@/components/library/FeaturedContent';
import LibraryHeader from '@/components/library/LibraryHeader';
import FormatTabs from '@/components/library/FormatTabs';
import TabContents from '@/components/library/TabContents';
import { ContentFormat } from '@/types/library';

const Library: React.FC = () => {
  const {
    content,
    filteredContent,
    featuredContent,
    allTags,
    allFormats,
    formatFilter,
    tagFilter,
    accessFilter,
    searchQuery,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery,
    setSelectedItem
  } = useLibraryContent();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [visitedTags, setVisitedTags] = useState<string[]>([]);

  // Simulate user interests based on local storage or default to some tags
  useEffect(() => {
    // In a real app, this would come from user behavior tracking
    const storedTags = localStorage.getItem('visitedTags');
    if (storedTags) {
      setVisitedTags(JSON.parse(storedTags));
    } else {
      // Default tags for new users
      const defaultTags = ['Web3', 'Development', 'AI'];
      setVisitedTags(defaultTags);
      localStorage.setItem('visitedTags', JSON.stringify(defaultTags));
    }
  }, []);

  // Track when user selects a tag
  useEffect(() => {
    if (tagFilter !== 'all' && !visitedTags.includes(tagFilter)) {
      const updatedTags = [...visitedTags, tagFilter].slice(-5); // Keep last 5
      setVisitedTags(updatedTags);
      localStorage.setItem('visitedTags', JSON.stringify(updatedTags));
    }
  }, [tagFilter, visitedTags]);

  const premiumContentCount = content.filter(item => item.accessLevel === 'premium').length;

  const videoContent = content.filter(item => item.format === 'video' || item.format === 'youtube' || item.format === 'vimeo');
  const documentContent = content.filter(item => item.format === 'pdf' || item.format === 'text' || item.format === 'gdoc');
  const audioContent = content.filter(item => item.format === 'audio');
  const courseContent = content.filter(item => item.format === 'course');
  const imageContent = content.filter(item => item.format === 'image');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'all' && value !== 'categories' && value !== 'tags') {
      setFormatFilter(value as ContentFormat);
    } else if (value === 'all') {
      setFormatFilter('all');
    }
  };

  // Get popular tags with content count
  const tagsWithCount = allTags.map(tag => ({
    name: tag,
    count: content.filter(item => item.tags.includes(tag)).length
  })).sort((a, b) => b.count - a.count);

  return (
    <MainLayout title="Content Library">
      <div className="mb-6">
        <LibraryHeader premiumContentCount={premiumContentCount} />
        
        {/* Tag Suggestions based on user interests */}
        {visitedTags.length > 0 && (
          <TagSuggestions 
            visitedTags={visitedTags} 
            allContent={content}
            onItemSelect={setSelectedItem}
          />
        )}
        
        {/* Trending Topics Section */}
        <TagsExplorer 
          tags={tagsWithCount.slice(0, 12)} 
          title="Trending Topics"
          className="mb-6"
        />
        
        {featuredContent.length > 0 && (
          <FeaturedContent 
            items={featuredContent}
            onItemSelect={setSelectedItem}
          />
        )}
        
        <FormatTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        >
          <TabContents 
            activeTab={activeTab}
            formatFilter={formatFilter}
            tagFilter={tagFilter}
            accessFilter={accessFilter}
            searchQuery={searchQuery}
            allFormats={allFormats}
            allTags={allTags}
            setFormatFilter={setFormatFilter}
            setTagFilter={setTagFilter}
            setAccessFilter={setAccessFilter}
            setSearchQuery={setSearchQuery}
            setActiveTab={setActiveTab}
            filteredContent={filteredContent}
            videoContent={videoContent}
            documentContent={documentContent}
            audioContent={audioContent}
            courseContent={courseContent}
            imageContent={imageContent}
            tagsWithCount={tagsWithCount}
            content={content}
            onItemSelect={setSelectedItem}
          />
        </FormatTabs>
      </div>
      
      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </MainLayout>
  );
};

export default Library;
