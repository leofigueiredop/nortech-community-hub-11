
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useToast } from '@/hooks/use-toast';
import { ContentItem, ContentCategory } from '@/types/library';
import ContentList from '@/components/library/management/ContentList';
import CategoriesList from '@/components/library/management/CategoriesList';
import ContentUploadForm from '@/components/library/management/ContentUploadForm';
import CategoryFormDialog from '@/components/library/management/CategoryFormDialog';

const ContentManagement: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
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

  const handleSaveCategory = (category: ContentCategory) => {
    if (editingCategory) {
      updateCategory(category);
      toast({
        title: "Category updated",
        description: `"${category.name}" has been updated successfully.`
      });
    } else {
      addCategory(category);
      toast({
        title: "Category added",
        description: `"${category.name}" has been added successfully.`
      });
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: ContentCategory) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  return (
    <MainLayout title="Content Management">
      <div className="container py-6 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <Button onClick={() => {
            setEditingContent(null);
            setIsUploadOpen(true);
          }} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content List Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Content List</h2>
            </div>
            <ContentList 
              items={content}
              onEdit={handleEditContent}
              onDelete={deleteContent}
              categories={categories}
            />
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Category List</h2>
              <Button onClick={() => {
                setEditingCategory(null);
                setIsCategoryFormOpen(true);
              }} className="bg-purple-500 hover:bg-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            <CategoriesList 
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={deleteCategory}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ContentUploadForm 
        isOpen={isUploadOpen}
        editItem={editingContent}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingContent(null);
        }}
        onSave={handleSaveContent}
      />

      <CategoryFormDialog
        isOpen={isCategoryFormOpen}
        editCategory={editingCategory}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />
    </MainLayout>
  );
};

export default ContentManagement;
