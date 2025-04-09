
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Upload, FileText, FileVideo, FileAudio, Link, Image, Youtube, LayoutGrid, Video } from 'lucide-react';
import { ContentItem, ContentFormat, AccessLevel, ContentVisibility, ContentUpload } from '@/types/library';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { v4 as uuidv4 } from 'uuid';

interface ContentUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  editItem: ContentItem | null;
}

const ContentFormatOptions: { value: ContentFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'video', label: 'Video (MP4)', icon: <FileVideo size={16} /> },
  { value: 'pdf', label: 'PDF Document', icon: <FileText size={16} /> },
  { value: 'audio', label: 'Audio File', icon: <FileAudio size={16} /> },
  { value: 'youtube', label: 'YouTube Link', icon: <Youtube size={16} /> },
  { value: 'vimeo', label: 'Vimeo Link', icon: <Video size={16} /> },
  { value: 'gdoc', label: 'Google Doc', icon: <FileText size={16} /> },
  { value: 'gdrive', label: 'Google Drive', icon: <LayoutGrid size={16} /> },
  { value: 'link', label: 'External Link', icon: <Link size={16} /> },
  { value: 'image', label: 'Image', icon: <Image size={16} /> },
  { value: 'text', label: 'Plain Text', icon: <FileText size={16} /> }
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  format: z.string().min(1, "Format is required"),
  resourceUrl: z.string().optional(),
  tags: z.string().optional(),
  accessLevel: z.enum(["free", "premium"]),
  visibility: z.enum(["public", "vip-only", "limited-time"]).optional(),
  categoryId: z.string().optional()
});

const ContentUploadForm: React.FC<ContentUploadFormProps> = ({ isOpen, onClose, onSave, editItem }) => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { categories, allTags } = useLibraryContent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      format: 'video',
      resourceUrl: '',
      tags: '',
      accessLevel: 'free',
      visibility: 'public',
      categoryId: ''
    }
  });

  useEffect(() => {
    if (editItem) {
      form.reset({
        title: editItem.title,
        description: editItem.description,
        format: editItem.format,
        resourceUrl: editItem.resourceUrl,
        tags: editItem.tags.join(', '),
        accessLevel: editItem.accessLevel,
        visibility: editItem.visibility || 'public',
        categoryId: editItem.categoryId || ''
      });
      setSelectedTags(editItem.tags);
      setPreviewImage(editItem.thumbnailUrl || null);
    } else {
      form.reset({
        title: '',
        description: '',
        format: 'video',
        resourceUrl: '',
        tags: '',
        accessLevel: 'free',
        visibility: 'public',
        categoryId: ''
      });
      setSelectedTags([]);
      setPreviewImage(null);
    }
    setFile(null);
    setThumbnailFile(null);
  }, [editItem, form, isOpen]);

  const needsFileUpload = (format: string) => {
    return ['video', 'pdf', 'audio', 'image'].includes(format);
  };

  const needsUrlInput = (format: string) => {
    return ['youtube', 'vimeo', 'gdoc', 'gdrive', 'link'].includes(format);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would handle file uploads here
    // For this example, we'll simulate it
    
    const now = new Date().toISOString();
    
    const newContent: ContentItem = {
      id: editItem?.id || uuidv4(),
      title: values.title,
      description: values.description,
      format: values.format as ContentFormat,
      resourceUrl: values.resourceUrl || (file ? `mock-file-path/${file.name}` : ''),
      thumbnailUrl: previewImage || '/placeholder.svg',
      tags: selectedTags,
      accessLevel: values.accessLevel as AccessLevel,
      createdAt: editItem?.createdAt || now,
      updatedAt: now,
      views: editItem?.views || 0,
      categoryId: values.categoryId || undefined,
      visibility: values.visibility as ContentVisibility || 'public',
      featured: editItem?.featured || false
    };
    
    // Add optional fields based on format
    if (['video', 'audio'].includes(values.format)) {
      newContent.duration = editItem?.duration || "00:00";
    }
    
    if (['pdf', 'image'].includes(values.format)) {
      newContent.fileSize = editItem?.fileSize || (file ? `${Math.round(file.size / 1024)} KB` : "0 KB");
    }
    
    onSave(newContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Content' : 'Upload New Content'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ContentFormatOptions.map(option => (
                            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                              {option.icon} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {needsFileUpload(form.watch('format')) && (
                  <div className="mt-4">
                    <FormLabel>File Upload</FormLabel>
                    <div className="border-2 border-dashed border-slate-300 rounded-md p-6 mt-1 text-center">
                      <Input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden"
                        id="content-file"
                      />
                      <label 
                        htmlFor="content-file"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm font-medium text-slate-900">Click to upload</span>
                        <span className="text-xs text-slate-500 mt-1">
                          {file ? file.name : 'Supports MP4, PDF, MP3, etc.'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
                
                {needsUrlInput(form.watch('format')) && (
                  <FormField
                    control={form.control}
                    name="resourceUrl"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Resource URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="mr-2"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {allTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Suggested tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {allTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-slate-100"
                            onClick={() => handleSelectTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" className="h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormLabel>Thumbnail</FormLabel>
                  <div className="border-2 border-dashed border-slate-300 rounded-md p-6 mt-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img 
                          src={previewImage} 
                          alt="Thumbnail preview" 
                          className="mx-auto max-h-40 object-contain" 
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                          id="thumbnail"
                        />
                        <label 
                          htmlFor="thumbnail"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-8 w-8 text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-900">Upload thumbnail</span>
                          <span className="text-xs text-slate-500 mt-1">PNG, JPG or GIF</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between mt-4 p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <FormLabel>Premium Content</FormLabel>
                        <p className="text-xs text-slate-500">
                          Only accessible by premium subscribers
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === 'premium'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'premium' : 'free')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="vip-only">VIP Members Only</SelectItem>
                          <SelectItem value="limited-time">Limited Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editItem ? 'Save Changes' : 'Upload Content'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploadForm;
