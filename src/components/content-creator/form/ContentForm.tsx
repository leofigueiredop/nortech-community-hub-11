
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ContentItem, ContentFormat } from '@/types/library';
import { useCategories } from '@/hooks/useCategories';
import TagInput from '@/components/ui/tag-input';
import UploadThumbnail from '../UploadThumbnail';
import FormatSelector from './FormatSelector';
import PointsSettings from './PointsSettings';

interface ContentFormProps {
  initialData?: Partial<ContentItem>;
  onSubmit: (data: Partial<ContentItem>) => void;
  isLoading?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading
}) => {
  const { categories } = useCategories();
  
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [format, setFormat] = useState<ContentFormat>(initialData.format || 'video');
  const [categoryId, setCategoryId] = useState(initialData.categoryId || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [thumbnail, setThumbnail] = useState(initialData.thumbnail || '');
  const [accessLevel, setAccessLevel] = useState<'free' | 'premium' | 'premium_plus'>(
    initialData.accessLevel as 'free' | 'premium' | 'premium_plus' || 'free'
  );
  const [isFeatured, setIsFeatured] = useState(initialData.featured || false);
  const [allowComments, setAllowComments] = useState(initialData.allowComments !== false);
  const [pointsEnabled, setPointsEnabled] = useState(initialData.pointsEnabled || false);
  const [pointsValue, setPointsValue] = useState(initialData.pointsValue || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contentData: Partial<ContentItem> = {
      title,
      description,
      format,
      categoryId,
      tags,
      thumbnail,
      accessLevel,
      featured: isFeatured,
      allowComments,
      pointsEnabled,
      pointsValue
    };
    
    onSubmit(contentData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter content title"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              rows={4}
              required
            />
          </div>
          
          {/* Format */}
          <FormatSelector value={format} onChange={setFormat} />
          
          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <TagInput
              placeholder="Add tags"
              tags={tags}
              setTags={setTags}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <UploadThumbnail
              value={thumbnail}
              onChange={setThumbnail}
            />
          </div>
          
          {/* Access Level */}
          <div>
            <Label htmlFor="accessLevel">Access Level</Label>
            <Select value={accessLevel} onValueChange={(value: 'free' | 'premium' | 'premium_plus') => setAccessLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="premium_plus">Premium Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Points Settings */}
          <PointsSettings
            enabled={pointsEnabled}
            setEnabled={setPointsEnabled}
            value={pointsValue}
            setValue={setPointsValue}
          />
          
          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured" 
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
            />
            <Label htmlFor="featured">Featured content</Label>
          </div>
          
          {/* Allow Comments */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allowComments" 
              checked={allowComments}
              onCheckedChange={(checked) => setAllowComments(checked as boolean)}
            />
            <Label htmlFor="allowComments">Allow comments</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData.id ? 'Update Content' : 'Create Content'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
