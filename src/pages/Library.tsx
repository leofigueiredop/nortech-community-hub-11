
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useLibraryState } from '@/hooks/useLibraryState';
import ContentViewer from '@/components/library/ContentViewer';
import LibraryContent from '@/components/library/LibraryContent';
import LibraryFiltersSection from '@/components/library/LibraryFiltersSection';
import LibraryHeaderSection from '@/components/library/LibraryHeaderSection';
import { useTheme } from 'next-themes';

const Library: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
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
    sortBy,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery,
    setSortBy,
    setSelectedItem
  } = useLibraryContent();

  const {
    visitedTags,
    showFilters,
    addVisitedTag,
    toggleFilters
  } = useLibraryState();

  // Track when user selects a tag
  useEffect(() => {
    if (tagFilter !== 'all') {
      addVisitedTag(tagFilter);
    }
  }, [tagFilter, addVisitedTag]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Check if any filters are applied
  const hasFilters = searchQuery !== '' || formatFilter !== 'all' || accessFilter !== 'all' || tagFilter !== 'all' || sortBy !== 'newest';

  // Premium content count for header
  const premiumContent = content.filter(item => item.accessLevel === 'premium');

  return (
    <MainLayout title="Content Library">
      <div className="relative">
        <LibraryHeaderSection
          premiumContentCount={premiumContent.length}
          theme={theme || 'light'}
          onToggleFilters={toggleFilters}
          onToggleTheme={toggleTheme}
        />

        <LibraryFiltersSection
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
          showFilters={showFilters}
        />

        <LibraryContent
          content={content}
          filteredContent={filteredContent}
          featuredContent={featuredContent}
          hasFilters={hasFilters}
          visitedTags={visitedTags}
          setSelectedItem={setSelectedItem}
        />
      </div>
      
      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </MainLayout>
  );
};

export default Library;
