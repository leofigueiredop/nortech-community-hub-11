
import React, { useState } from 'react';
import { ContentCategory } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash, Plus, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CategoriesManagementProps {
  categories: ContentCategory[];
  onAddCategory: (category: ContentCategory) => void;
  onUpdateCategory: (category: ContentCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoriesManagement: React.FC<CategoriesManagementProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentCategory, setCurrentCategory] = useState<ContentCategory | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [iconInput, setIconInput] = useState('');
  const { toast } = useToast();

  const openAddDialog = () => {
    setDialogMode('add');
    setNameInput('');
    setDescriptionInput('');
    setSlugInput('');
    setParentId(undefined);
    setIconInput('');
    setShowDialog(true);
  };

  const openEditDialog = (category: ContentCategory) => {
    setDialogMode('edit');
    setCurrentCategory(category);
    setNameInput(category.name);
    setDescriptionInput(category.description || '');
    setSlugInput(category.slug);
    setParentId(category.parent_id);
    setIconInput(category.icon || '');
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!nameInput || !slugInput) {
      toast({
        title: "Required fields missing",
        description: "Name and slug are required fields.",
        variant: "destructive"
      });
      return;
    }

    const categoryData: ContentCategory = {
      id: dialogMode === 'add' ? `cat-${Date.now()}` : currentCategory!.id,
      name: nameInput,
      description: descriptionInput || undefined,
      slug: slugInput,
      parent_id: parentId,
      icon: iconInput || undefined,
      created_at: dialogMode === 'add' ? new Date().toISOString() : currentCategory!.created_at,
      updated_at: new Date().toISOString(),
      itemCount: dialogMode === 'edit' ? (currentCategory?.itemCount || 0) : 0
    };

    if (dialogMode === 'add') {
      onAddCategory(categoryData);
      toast({
        title: "Category created",
        description: `Category "${nameInput}" has been created successfully.`
      });
    } else {
      onUpdateCategory(categoryData);
      toast({
        title: "Category updated",
        description: `Category "${nameInput}" has been updated successfully.`
      });
    }

    setShowDialog(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? This cannot be undone.`)) {
      onDeleteCategory(id);
      toast({
        title: "Category deleted",
        description: `Category "${name}" has been deleted.`
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories Management</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="border rounded-md">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <Folder className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No categories yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first category to organize content</p>
            <Button onClick={openAddDialog} variant="outline">Add Category</Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Parent</th>
                <th className="text-center px-4 py-3 font-medium">Content Items</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {category.parent_id ? categories.find(c => c.id === category.parent_id)?.name : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">{category.itemCount || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id, category.name)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g., Programming Tutorials"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input 
                id="slug" 
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="e.g., programming-tutorials"
              />
              <p className="text-sm text-muted-foreground">Used in URLs, automatically generated from name</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Brief description of this category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <select 
                id="parent"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value === '' ? undefined : e.target.value)}
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter(cat => cat.id !== (currentCategory?.id || ''))
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input 
                id="icon" 
                value={iconInput}
                onChange={(e) => setIconInput(e.target.value)}
                placeholder="e.g., 💻"
              />
              <p className="text-sm text-muted-foreground">Use a single emoji as an icon</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{dialogMode === 'add' ? 'Create Category' : 'Update Category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
