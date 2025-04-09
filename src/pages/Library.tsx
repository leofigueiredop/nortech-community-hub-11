
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import ContentFilters from '@/components/library/ContentFilters';
import ContentGrid from '@/components/library/ContentGrid';
import FeaturedContent from '@/components/library/FeaturedContent';
import ContentViewer from '@/components/library/ContentViewer';
import UpsellBlock from '@/components/library/UpsellBlock';
import TagsExplorer from '@/components/tags/TagsExplorer';
import TagSuggestions from '@/components/tags/TagSuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Folder, Upload, FileVideo, File, FileAudio, BookOpen, Image, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link as RouterLink } from 'react-router-dom';
import { ContentFormat } from '@/types/library';
import { Badge } from '@/components/ui/badge';

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
  }, [tagFilter]);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Library</h1>
          <Button asChild>
            <RouterLink to="/library/manage" className="flex items-center gap-2">
              <Upload size={16} />
              Manage Content
            </RouterLink>
          </Button>
        </div>
        
        <div className="mb-6">
          <UpsellBlock premiumContentCount={premiumContentCount} purchaseType="both" />
        </div>
        
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
        
        <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-purple-100 dark:bg-slate-800">
              <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <FileText size={16} /> All Content
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <FileVideo size={16} /> Videos
              </TabsTrigger>
              <TabsTrigger value="pdf" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <File size={16} /> Documents
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <FileAudio size={16} /> Audio
              </TabsTrigger>
              <TabsTrigger value="course" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <BookOpen size={16} /> Courses
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Image size={16} /> Images
              </TabsTrigger>
              <TabsTrigger value="tags" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Tag size={16} /> Tags
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Folder size={16} /> Categories
              </TabsTrigger>
            </TabsList>
          </div>
          
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
            />
            
            <ContentGrid 
              items={filteredContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="video">
            <ContentGrid 
              items={videoContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="pdf">
            <ContentGrid 
              items={documentContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="audio">
            <ContentGrid 
              items={audioContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="course">
            <ContentGrid 
              items={courseContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="image">
            <ContentGrid 
              items={imageContent} 
              onItemSelect={setSelectedItem} 
            />
          </TabsContent>
          
          <TabsContent value="tags">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Browse Content by Tags</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tagsWithCount.map(tag => (
                  <div 
                    key={tag.name} 
                    className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                    onClick={() => {
                      setTagFilter(tag.name);
                      setActiveTab('all');
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500">#{tag.name}</Badge>
                      <span className="text-sm text-muted-foreground">{tag.count} items</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <RouterLink to={`/tags/${tag.name}`} className="text-purple-600 hover:underline">
                        View all content with this tag
                      </RouterLink>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTags.map(tag => (
                <div 
                  key={tag} 
                  className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                  onClick={() => {
                    setTagFilter(tag);
                    setActiveTab('all');
                  }}
                >
                  <h3 className="font-medium text-lg mb-1">{tag}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.filter(item => item.tags.includes(tag)).length} items
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </MainLayout>
  );
};

export default Library;
