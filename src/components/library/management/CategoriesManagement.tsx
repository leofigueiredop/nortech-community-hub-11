import React, { useState, useEffect } from 'react';
import { ContentCategory } from '@/types/content';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CategoriesManagement: React.FC = () => {
  const { 
    categories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    content 
  } = useLibraryContent();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (editCategoryId) {
      const categoryToEdit = categories.find(cat => cat.id === editCategoryId);
      if (categoryToEdit) {
        setEditCategoryName(categoryToEdit.name);
        setEditCategoryDescription(categoryToEdit.description || '');
      }
    }
  }, [editCategoryId, categories]);

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === '') {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Omit<ContentCategory, 'id' | 'created_at' | 'updated_at'> = {
      name: newCategoryName,
      description: newCategoryDescription,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
    };

    await createCategory(newCategory);
    setNewCategoryName('');
    setNewCategoryDescription('');
    toast({
      title: "Success",
      description: "Category created successfully.",
    });
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryId) return;

    if (editCategoryName.trim() === '') {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    const updatedCategory: Partial<ContentCategory> = {
      id: editCategoryId,
      name: editCategoryName,
      description: editCategoryDescription,
      slug: editCategoryName.toLowerCase().replace(/\s+/g, '-'),
    };

    await updateCategory(editCategoryId, updatedCategory);
    setEditCategoryId(null);
    setEditCategoryName('');
    setEditCategoryDescription('');
    toast({
      title: "Success",
      description: "Category updated successfully.",
    });
  };

  const handleDeleteCategory = async (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (!categoryToDelete) return;

    // Check if any content items are associated with this category
    const itemCount = content.filter(item => item.categoryId === id).length;

    if (itemCount > 0) {
      toast({
        title: "Error",
        description: `Cannot delete category. ${itemCount} content items are associated with it.`,
        variant: "destructive"
      });
      return;
    }

    await deleteCategory(id);
    toast({
      title: "Success",
      description: "Category deleted successfully.",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Manage Categories</h2>
        <p className="text-muted-foreground">
          Create, edit, and delete content categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-medium mb-4">Create New Category</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Category description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateCategory}>Create Category</Button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">Edit Category</h3>
          {editCategoryId ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Category name"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="Category description"
                  value={editCategoryDescription}
                  onChange={(e) => setEditCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateCategory}>Update Category</Button>
                <Button variant="secondary" onClick={() => setEditCategoryId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a category to edit.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Categories List</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const itemCount = content.filter(item => item.categoryId === category.id).length;
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditCategoryId(category.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No categories created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;
