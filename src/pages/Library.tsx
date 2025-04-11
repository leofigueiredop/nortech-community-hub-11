
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useLibraryState } from '@/hooks/useLibraryState';
import ContentViewer from '@/components/library/ContentViewer';
import CreateContentModal from '@/components/library/CreateContentModal';
import LibraryTopBar from '@/components/library/LibraryTopBar';
import LibraryContentArea from '@/components/library/LibraryContentArea';
import CreateContentButton from '@/components/library/CreateContentButton';
import ContentFilters from '@/components/library/ContentFilters';

const Library: React.FC = () => {
  const [activeView, setActiveView] = useState<'all' | 'free' | 'premium' | 'unlockable'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  
  const {
    content,
    filteredContent,
    featuredContent,
    allTags,
    allFormats,
    formatFilter,
    tagFilter,
    accessFilter,
    sortBy,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery: setGlobalSearchQuery,
    setSortBy,
    setSelectedItem
  } = useLibraryContent();

  const {
    visitedTags,
    addVisitedTag
  } = useLibraryState();

  useEffect(() => {
    if (tagFilter !== 'all') {
      addVisitedTag(tagFilter);
    }
  }, [tagFilter, addVisitedTag]);

  useEffect(() => {
    if (activeView === 'all') {
      setAccessFilter('all');
    } else if (activeView === 'free') {
      setAccessFilter('free');
    } else if (activeView === 'premium') {
      setAccessFilter('premium');
    } else if (activeView === 'unlockable') {
      setAccessFilter('unlockable');
    }
  }, [activeView, setAccessFilter]);

  const isSearchActive = searchQuery.trim() !== '';

  return (
    <MainLayout title="Content Library">
      <div className="relative min-h-screen flex flex-col">
        <LibraryTopBar
          formatFilter={formatFilter}
          tagFilter={tagFilter}
          sortBy={sortBy}
          activeView={activeView}
          searchQuery={searchQuery}
          setActiveView={setActiveView}
          setSearchQuery={setSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          allTags={allTags}
          allFormats={allFormats}
          setFormatFilter={setFormatFilter}
          setTagFilter={setTagFilter}
          setSortBy={setSortBy}
        />

        <ContentFilters 
          formatFilter={formatFilter}
          tagFilter={tagFilter}
          accessFilter={accessFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          allFormats={allFormats}
          allTags={allTags}
          setFormatFilter={setFormatFilter}
          setTagFilter={setTagFilter}
          setAccessFilter={setAccessFilter}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
        />

        <LibraryContentArea
          isSearchActive={isSearchActive}
          filteredContent={filteredContent}
          searchQuery={searchQuery}
          activeView={activeView}
          featuredContent={featuredContent}
          content={content}
          visitedTags={visitedTags}
          onItemSelect={setSelectedItem}
        />
      </div>

      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <CreateContentModal 
        isOpen={isCreateContentOpen} 
        onClose={() => setIsCreateContentOpen(false)} 
      />

      <CreateContentButton onClick={() => setIsCreateContentOpen(true)} />
    </MainLayout>
  );
};

export default Library;
