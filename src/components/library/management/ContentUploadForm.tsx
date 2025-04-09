
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ContentItem, ContentFormat, AccessLevel, ContentVisibility } from '@/types/library';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { v4 as uuidv4 } from 'uuid';
import ContentBasicInfo from './form/ContentBasicInfo';
import FileUploader from './form/FileUploader';
import TagsInput from './form/TagsInput';
import AccessOptions from './form/AccessOptions';
import ResourceUrlInput from './form/ResourceUrlInput';
import { needsFileUpload, needsUrlInput } from './constants/contentFormOptions';

interface ContentUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  editItem: ContentItem | null;
}

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
      categoryId: values.categoryId === 'none' ? undefined : values.categoryId,
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
                <ContentBasicInfo form={form} categories={categories} />
                
                {needsFileUpload(form.watch('format')) && (
                  <FileUploader
                    label="File Upload"
                    onFileChange={setFile}
                    id="content-file"
                    placeholder="Click to upload"
                    helpText={`Supports ${form.watch('format')} files`}
                  />
                )}
                
                {needsUrlInput(form.watch('format')) && (
                  <ResourceUrlInput form={form} />
                )}
                
                <TagsInput
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  allTags={allTags}
                />
              </div>
              
              <div>
                <FileUploader
                  label="Thumbnail"
                  onFileChange={setThumbnailFile}
                  onPreviewChange={setPreviewImage}
                  previewImage={previewImage}
                  accept="image/*"
                  id="thumbnail"
                  placeholder="Upload thumbnail"
                  helpText="PNG, JPG or GIF"
                />
                
                <AccessOptions form={form} />
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
