
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import ContentFilters from '@/components/library/ContentFilters';
import ContentGrid from '@/components/library/ContentGrid';
import FeaturedContent from '@/components/library/FeaturedContent';
import ContentViewer from '@/components/library/ContentViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Folder } from 'lucide-react';

const Library: React.FC = () => {
  const {
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

  return (
    <MainLayout title="Content Library">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Library</h1>
        </div>
        
        {featuredContent.length > 0 && (
          <FeaturedContent 
            items={featuredContent}
            onItemSelect={setSelectedItem}
          />
        )}
        
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <FileText size={16} /> All Content
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
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
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTags.map(tag => (
                <div 
                  key={tag} 
                  className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                  onClick={() => {
                    setTagFilter(tag);
                    document.querySelector('[data-value="all"]')?.click();
                  }}
                >
                  <h3 className="font-medium text-lg mb-1">{tag}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredContent.filter(item => item.tags.includes(tag)).length} items
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
