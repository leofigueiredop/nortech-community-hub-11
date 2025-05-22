import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ContentItem, ContentFormat } from '@/types/content';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/StorageService';
import ContentBasicInfo from './form/ContentBasicInfo';
import FileUploader from './form/FileUploader';
import TagsInput from './form/TagsInput';
import AccessOptions from './form/AccessOptions';
import ResourceUrlInput from './form/ResourceUrlInput';
import { needsFileUpload, needsUrlInput } from './constants/contentFormOptions';
import { POINTS_VALUES } from '@/context/PointsContext';
import { toast } from '@/components/ui/use-toast';

interface ContentUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem, contentFile?: File, thumbnailFile?: File) => void;
  editItem: ContentItem | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  format: z.string().min(1, "Format is required"),
  resourceUrl: z.string().optional(),
  tags: z.string().optional(),
  accessLevel: z.string().min(1, "Access level is required"),
  visibility: z.string().optional(),
  categoryId: z.string().optional(),
  pointsEnabled: z.boolean().default(false),
  pointsValue: z.number().default(POINTS_VALUES.content_completion),
  completionCriteria: z.enum(["view", "scroll_end", "watch_percent", "time_spent"]).optional(),
  completionThreshold: z.number().optional()
});

const ContentUploadForm: React.FC<ContentUploadFormProps> = ({ isOpen, onClose, onSave, editItem }) => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { categories, allTags } = useLibraryContent();
  const { community } = useAuth();

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
      categoryId: '',
      pointsEnabled: false,
      pointsValue: POINTS_VALUES.content_completion,
      completionCriteria: 'view',
      completionThreshold: 80
    }
  });

  useEffect(() => {
    if (editItem) {
      form.reset({
        title: editItem.title,
        description: editItem.description || '',
        format: editItem.format,
        resourceUrl: editItem.resource_url || '',
        tags: editItem.tags ? editItem.tags.join(', ') : '',
        accessLevel: editItem.access_level || 'free',
        visibility: editItem.visibility || 'public',
        categoryId: editItem.category_id || '',
        pointsEnabled: editItem.points_enabled || false,
        pointsValue: editItem.points_value || POINTS_VALUES.content_completion,
        completionCriteria: editItem.completion_criteria as any || 'view',
        completionThreshold: editItem.completion_threshold || 80
      });
      setSelectedTags(editItem.tags || []);
      setPreviewImage(editItem.thumbnail || null);
    } else {
      form.reset({
        title: '',
        description: '',
        format: 'video',
        resourceUrl: '',
        tags: '',
        accessLevel: 'free',
        visibility: 'public',
        categoryId: '',
        pointsEnabled: false,
        pointsValue: POINTS_VALUES.content_completion,
        completionCriteria: 'view',
        completionThreshold: 80
      });
      setSelectedTags([]);
      setPreviewImage(null);
    }
    setFile(null);
    setThumbnailFile(null);
  }, [editItem, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!community) {
        toast({
          title: "Error",
          description: "Community context is missing",
          variant: "destructive"
        });
        return;
      }
      
      setIsUploading(true);
      
      // We'll let the parent component handle file uploads and Supabase insertion
      // This ensures proper transaction management and error handling
      const newContent: Partial<ContentItem> = {
        title: values.title,
        description: values.description,
        format: values.format as ContentFormat,
        access_level: values.accessLevel as any,
        category_id: values.categoryId === 'none' ? undefined : values.categoryId,
        tags: selectedTags,
        visibility: values.visibility as any || 'public',
        points_enabled: values.pointsEnabled,
        points_value: values.pointsValue,
        completion_criteria: values.completionCriteria || 'view',
        completion_threshold: values.completionThreshold || 80,
      };
      
      // If there's a resource URL (for link-type content)
      if (values.resourceUrl) {
        newContent.resource_url = values.resourceUrl;
      }
      
      // Let parent component save with files for upload
      onSave(newContent as ContentItem, file, thumbnailFile);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
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
                    accept={getAcceptForFormat(form.watch('format'))}
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
              <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : editItem ? 'Save Changes' : 'Upload Content'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get the accept string for different content formats
function getAcceptForFormat(format: string): string {
  switch (format) {
    case 'video':
      return 'video/*,.mp4,.mov,.avi,.webm';
    case 'audio':
      return 'audio/*,.mp3,.wav,.ogg,.m4a';
    case 'pdf':
      return '.pdf';
    case 'image':
      return 'image/*,.jpg,.jpeg,.png,.gif,.webp';
    default:
      return '*';
  }
}

export default ContentUploadForm;
