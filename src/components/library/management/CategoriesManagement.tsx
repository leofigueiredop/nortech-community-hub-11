
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Edit, Trash2, FolderPlus } from 'lucide-react';
import { ContentCategory } from '@/types/library';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const CategoriesManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useLibraryContent();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  const handleOpenDialog = (category?: ContentCategory) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || '');
      setIcon(category.icon || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setIcon('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please enter a name for the category."
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      updateCategory({
        ...editingCategory,
        name,
        description,
        icon
      });
      toast({
        title: "Category updated",
        description: `"${name}" has been updated successfully.`
      });
    } else {
      // Create new category
      const newCategory: ContentCategory = {
        id: uuidv4(),
        name,
        description,
        itemCount: 0,
        icon
      };
      addCategory(newCategory);
      toast({
        title: "Category created",
        description: `"${name}" has been added successfully.`
      });
    }
    handleCloseDialog();
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    toast({
      title: "Category deleted",
      description: "The category has been removed successfully."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={() => handleOpenDialog()}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Items: <span className="font-medium">{category.itemCount}</span>
              </p>
              {category.icon && (
                <div className="mt-2 text-sm">
                  Icon: <span className="font-medium">{category.icon}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenDialog(category)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the details of this category.' 
                : 'Create a new category to organize your content.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Category description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Lucide icon name)</Label>
              <Input 
                id="icon" 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)} 
                placeholder="e.g., book, video, folder"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
