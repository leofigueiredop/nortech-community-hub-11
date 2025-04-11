
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import ContentViewer from '@/components/library/ContentViewer';
import FeaturedContentCarousel from '@/components/library/FeaturedContentCarousel';
import ContentSection from '@/components/library/ContentSection';
import LibraryHeader from '@/components/library/LibraryHeader';
import ContentFilters from '@/components/library/ContentFilters';
import PremiumContentUpgrade from '@/components/feed/PremiumContentUpgrade';
import { ContentFormat } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

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

  const [visitedTags, setVisitedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

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

  // Handle filter toggle
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Create a ref for the scroll area to implement sticky header
  const hasFilters = searchQuery !== '' || formatFilter !== 'all' || accessFilter !== 'all' || tagFilter !== 'all' || sortBy !== 'newest';

  return (
    <MainLayout title="Content Library">
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <LibraryHeader 
            premiumContentCount={premiumContent.length} 
            onToggleFilters={toggleFilters}
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>

        {showFilters && (
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
        )}

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
      </div>
      
      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </MainLayout>
  );
};

export default Library;
