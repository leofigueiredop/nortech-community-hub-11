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
import { adaptLibraryArrayToContentType } from '@/utils/contentTypeAdapter';

// Define ContentItem if it's not exported from the library
interface ContentItem {
  id: string;
  title: string;
  description?: string;
  format?: string;
  thumbnail?: string;
  author?: any;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  duration?: number;
  accessLevel?: string;
  featured?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  [key: string]: any;
}

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { content, categories, addContent, updateContent, deleteContent, addCategory, updateCategory, deleteCategory } = useLibraryContent();
  const { toast } = useToast();

  const handleSaveContent = (newContent: ContentItem) => {
    if (editingContent) {
      updateContent(newContent);
      toast({
        title: "Content updated",
        description: `"${newContent.title}" has been updated successfully.`
      });
    } else {
      addContent(newContent);
      toast({
        title: "Content added",
        description: `"${newContent.title}" has been added to your library.`
      });
    }
    setIsUploadOpen(false);
    setEditingContent(null);
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
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
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
