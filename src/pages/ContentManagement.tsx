import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FolderPlus, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentUploadForm from '@/components/library/management/ContentUploadForm';
import ContentList from '@/components/library/management/ContentList';
import CategoriesManagement from '@/components/library/management/CategoriesManagement';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/StorageService';
import { ContentItem, ContentCategory } from '@/types/content';
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isUploading, setIsUploading] = useState(false);
  const { content, categories, addContent, updateContent, deleteContent, addCategory, updateCategory, deleteCategory } = useLibraryContent();
  const { toast } = useToast();
  const { community } = useAuth();

  const handleSaveContent = async (newContent: ContentItem, contentFile?: File, thumbnailFile?: File) => {
    if (!community?.id) {
      toast({
        title: "Error",
        description: "Community context is missing",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload content file if provided
      let resourceUrl = newContent.resource_url;
      if (contentFile) {
        resourceUrl = await StorageService.uploadFile(
          contentFile,
          community.id,
          'content',
          { customFileName: `content-${Date.now()}` }
        );
      }
      
      // Upload thumbnail if provided
      let thumbnailUrl = newContent.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await StorageService.uploadFile(
          thumbnailFile,
          community.id,
          'content',
          { customFileName: `thumbnail-${Date.now()}` }
        );
      }
      
      // Update content with uploaded URLs
      const updatedContent: Partial<ContentItem> = {
        ...newContent,
        resource_url: resourceUrl || newContent.resource_url,
        thumbnail: thumbnailUrl || newContent.thumbnail,
        community_id: community.id,
        file_size: contentFile?.size
      };

      if (editingContent) {
        await updateContent(editingContent.id, updatedContent, thumbnailFile);
        toast({
          title: "Content updated",
          description: `"${updatedContent.title}" has been updated successfully.`
        });
      } else {
        await addContent(updatedContent, thumbnailFile);
        toast({
          title: "Content added",
          description: `"${updatedContent.title}" has been added to your library.`
        });
      }
      
      setIsUploadOpen(false);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setIsUploadOpen(true);
  };

  const handleDeleteContent = (id: string) => {
    deleteContent(id);
    toast({
      title: "Content deleted",
      description: "The content has been removed from your library."
    });
  };

  // Wrapper functions for category management to match expected interfaces
  const handleAddCategory = async (category: ContentCategory) => {
    await addCategory(category);
  };

  const handleUpdateCategory = async (category: ContentCategory) => {
    if (category.id) {
      await updateCategory(category.id, category);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
  };

  // Check if ContentList component accepts these props, otherwise remove them
  const handleNavigate = (item: ContentItem) => {
    if (item.format === 'course') {
      navigate(`/course/${item.id}`);
    } else {
      navigate(`/content/${item.id}`);
    }
  };

  return (
    <MainLayout title="Content Management">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground">
              Manage your courses, videos, and other content
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'default' : 'outline'}>
              <List size={16} />
            </Button>
            <Button onClick={() => setViewMode('grid')} variant={viewMode === 'grid' ? 'default' : 'outline'}>
              <Grid size={16} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <List size={16} /> Content
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <FolderPlus size={16} /> Categories
              </TabsTrigger>
            </TabsList>

            <Button 
              onClick={() => {
                setEditingContent(null);
                setIsUploadOpen(true);
              }}
              className="flex items-center gap-2"
              disabled={isUploading}
            >
              <Plus size={16} />
              Add Content
            </Button>
          </div>
          
          <TabsContent value="content">
            <ContentList 
              items={content}
              viewMode={viewMode}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              categories={categories}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesManagement 
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ContentUploadForm 
        isOpen={isUploadOpen}
        editItem={editingContent}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingContent(null);
        }}
        onSave={handleSaveContent}
      />
    </MainLayout>
  );
};

export default ContentManagement;
