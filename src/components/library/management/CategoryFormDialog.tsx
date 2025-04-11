
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContentCategory } from '@/types/library';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface CategoryFormDialogProps {
  isOpen: boolean;
  editCategory: ContentCategory | null;
  onClose: () => void;
  onSave: (category: ContentCategory) => void;
}

interface FormValues {
  name: string;
  description: string;
  icon: string;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({ 
  isOpen, 
  editCategory, 
  onClose, 
  onSave 
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen && editCategory) {
      reset({
        name: editCategory.name,
        description: editCategory.description || '',
        icon: editCategory.icon || ''
      });
    } else if (isOpen) {
      reset({
        name: '',
        description: '',
        icon: ''
      });
    }
  }, [isOpen, editCategory, reset]);

  const onSubmit = (data: FormValues) => {
    const category: ContentCategory = {
      id: editCategory?.id || uuidv4(),
      name: data.name,
      description: data.description || undefined,
      itemCount: editCategory?.itemCount || 0,
      icon: data.icon || undefined
    };
    onSave(category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Category name is required' })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter a description for this category"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                {...register('icon')}
                placeholder="e.g., book, video, folder"
              />
              <p className="text-xs text-muted-foreground">
                Enter a Lucide icon name (optional)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
              {editCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
