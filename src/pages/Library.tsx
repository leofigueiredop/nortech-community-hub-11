import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useLibraryState } from '@/hooks/useLibraryState';
import ContentViewer from '@/components/library/ContentViewer';
import CreateContentModal from '@/components/library/CreateContentModal';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryContentArea from '@/components/library/LibraryContentArea';
import LibraryFiltersSection from '@/components/library/LibraryFiltersSection';
import { useContentProgress } from '@/hooks/useContentProgress';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award } from 'lucide-react';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'all' | 'free' | 'premium' | 'unlockable'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [showWeeklyChallenge, setShowWeeklyChallenge] = useState(true);
  
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

  const { contentProgress, getAllProgress } = useContentProgress();

  const totalItems = content.length;
  const completedItems = contentProgress.filter(item => item.completed || item.completed_at !== null).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

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

  const getCompletedVideosThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const completedThisWeek = contentProgress.filter(progress => {
      const lastAccessed = new Date(progress.lastAccessedAt || progress.last_accessed_at);
      return (progress.completed || progress.completed_at !== null) && 
             lastAccessed >= startOfWeek && 
             content.find(item => item.id === (progress.contentId || progress.content_id))?.format === 'video';
    });
    
    return completedThisWeek.length;
  };

  const handleContentManagement = () => {
    navigate('/content-management');
  };

  return (
    <MainLayout title="Content Library">
      <div className="relative min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="bg-card border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Library Progress</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{completedItems}</span>
                <span className="text-muted-foreground">/{totalItems} items completed</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Total XP: 1,250</span>
            </div>
          </div>
        </div>
        
        {/* Weekly Challenge */}
        {showWeeklyChallenge && (
          <div className="bg-primary/10 border-b border-primary/20 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium">Weekly Challenge: </span>
                  <span>Complete 3 Videos this Week</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="font-medium">{getCompletedVideosThisWeek()}</span>
                  <span className="text-muted-foreground">/3 completed</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7"
                  onClick={() => setShowWeeklyChallenge(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        <LibraryFilters
          searchQuery={searchQuery}
          onSearchChange={setGlobalSearchQuery}
        />

        <LibraryFiltersSection
          formatFilter={formatFilter}
          tagFilter={tagFilter}
          accessFilter={accessFilter}
          sortBy={sortBy}
          searchQuery={searchQuery}
          allTags={allTags}
          allFormats={allFormats}
          setFormatFilter={setFormatFilter}
          setTagFilter={setTagFilter}
          setAccessFilter={setAccessFilter}
          setSearchQuery={setGlobalSearchQuery}
          setSortBy={setSortBy}
          showFilters={true}
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

      {selectedItem && (
        <ContentViewer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      <CreateContentModal 
        isOpen={isCreateContentOpen} 
        onClose={() => setIsCreateContentOpen(false)} 
      />
    </MainLayout>
  );
};

export default Library;
