
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ContentFilters from '@/components/library/ContentFilters';
import ContentGrid from '@/components/library/ContentGrid';
import TagsSection from '@/components/library/TagsSection';
import CategoriesSection from '@/components/library/CategoriesSection';
import { ContentItem } from '@/types/library';

interface TabContentsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void; // Added this missing prop
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSearchQuery: (query: string) => void;
  filteredContent: ContentItem[];
  videoContent: ContentItem[];
  documentContent: ContentItem[];
  audioContent: ContentItem[];
  imageContent: ContentItem[];
  tagsWithCount: Array<{name: string, count: number}>;
  content: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const TabContents: React.FC<TabContentsProps> = ({ 
  activeTab,
  setActiveTab, // Added to props destructuring
  formatFilter,
  tagFilter,
  accessFilter,
  searchQuery,
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSearchQuery,
  filteredContent,
  videoContent,
  documentContent,
  audioContent,
  imageContent,
  tagsWithCount,
  content,
  onItemSelect
}) => {
  return (
    <>
      <TabsContent value="all">
        <ContentFilters
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
          sortBy="newest"
          setSortBy={() => {}}
        />
        
        <ContentGrid 
          items={filteredContent} 
          onItemSelect={onItemSelect} 
        />
      </TabsContent>
      
      <TabsContent value="video">
        <ContentGrid 
          items={videoContent} 
          onItemSelect={onItemSelect} 
        />
      </TabsContent>
      
      <TabsContent value="pdf">
        <ContentGrid 
          items={documentContent} 
          onItemSelect={onItemSelect} 
        />
      </TabsContent>
      
      <TabsContent value="audio">
        <ContentGrid 
          items={audioContent} 
          onItemSelect={onItemSelect} 
        />
      </TabsContent>
      
      <TabsContent value="image">
        <ContentGrid 
          items={imageContent} 
          onItemSelect={onItemSelect} 
        />
      </TabsContent>
      
      <TabsContent value="tags">
        <TagsSection 
          tagsWithCount={tagsWithCount}
          setTagFilter={setTagFilter}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="categories">
        <CategoriesSection 
          allTags={allTags}
          setTagFilter={setTagFilter}
          setActiveTab={setActiveTab}
          content={content}
        />
      </TabsContent>
    </>
  );
};

export default TabContents;
