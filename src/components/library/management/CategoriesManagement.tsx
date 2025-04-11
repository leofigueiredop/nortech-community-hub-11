
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Folder } from 'lucide-react';
import { ContentCategory } from '@/types/library';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useToast } from '@/hooks/use-toast';

const CategoriesManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useLibraryContent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOpenForm = (category?: ContentCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date().toISOString();
    
    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryName,
        description: categoryDescription || undefined,
        updatedAt: now
      });
      toast({
        title: "Category updated",
        description: `"${categoryName}" has been updated successfully.`
      });
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: categoryName,
        description: categoryDescription || undefined,
        count: 0,
        createdAt: now,
        updatedAt: now
      });
      toast({
        title: "Category created",
        description: `"${categoryName}" has been created successfully.`
      });
    }
    
    handleCloseForm();
  };

  const confirmDelete = (id: string) => {
    deleteCategory(id);
    setDeleteId(null);
    toast({
      title: "Category deleted",
      description: "The category has been removed."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Content Categories</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>
      
      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories yet</h3>
            <p className="text-slate-500 text-center mb-4">
              Create categories to organize your content library
            </p>
            <Button onClick={() => handleOpenForm()}>
              <Plus size={16} className="mr-2" /> Add Your First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Content Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-md truncate">{category.description || '-'}</TableCell>
                <TableCell className="text-right">{category.count}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 mr-1"
                    onClick={() => handleOpenForm(category)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Add/Edit Category Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this category? Content in this category will not be deleted, but will be uncategorized.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteId && confirmDelete(deleteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
