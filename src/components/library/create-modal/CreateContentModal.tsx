
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentFormat } from '@/types/library';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

import BasicInfoTab from './tabs/BasicInfoTab';
import MediaTab from './tabs/MediaTab';
import VisibilityTab from './tabs/VisibilityTab';
import AdvancedTab from './tabs/AdvancedTab';
import { contentFormSchema } from './schema';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = z.infer<typeof contentFormSchema>;

const CreateContentModal: React.FC<CreateContentModalProps> = ({ isOpen, onClose }) => {
  const { addContent, allTags } = useLibraryContent();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<FormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      format: 'video',
      accessLevel: 'free',
      pointsEnabled: false,
      pointsValue: 100,
      featured: false,
      addToCarousel: false,
      linkToCourse: '',
      scheduleDate: '',
      attachToChallenge: '',
      internalNotes: '',
    }
  });

  const resetForm = () => {
    form.reset();
    setSelectedTags([]);
    setFile(null);
    setThumbnailFile(null);
    setPreviewImage(null);
    setActiveTab('basic');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    const now = new Date().toISOString();
    
    const newContent = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      format: values.format as ContentFormat,
      thumbnail: file ? `mock-file-path/${file.name}` : '',
      thumbnailUrl: previewImage || '/placeholder.svg',
      tags: selectedTags,
      access_level: values.accessLevel === 'unlockable' ? 'premium' : values.accessLevel,
      accessLevel: values.accessLevel === 'unlockable' ? 'premium' : values.accessLevel,
      created_at: now,
      createdAt: now,
      updated_at: now,
      updatedAt: now,
      views: 0,
      duration: 0, 
      author: 'System User',
      featured: values.featured,
      is_featured: values.featured,
      pointsEnabled: values.accessLevel === 'unlockable' || values.pointsEnabled,
      pointsValue: values.pointsValue,
      visibility: values.accessLevel,
      resourceUrl: file ? `mock-file-path/${file.name}` : '',
      completionCriteria: 'view',
      completionThreshold: 80,
      community_id: 'default-community', // Add required property
    };
    
    // Add the content to the library
    addContent(newContent);
    
    toast({
      title: "Content created",
      description: `${values.title} has been added to your library.`
    });
    
    handleClose();
  };

  const isBasicInfoValid = form.formState.isValid;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Content
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
                <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
                <TabsTrigger value="visibility" className="flex-1">Visibility</TabsTrigger>
                <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
              </TabsList>
              
              <BasicInfoTab 
                form={form} 
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                allTags={allTags}
                isBasicInfoValid={isBasicInfoValid}
                setActiveTab={setActiveTab}
              />
              
              <MediaTab 
                form={form}
                file={file}
                setFile={setFile}
                thumbnailFile={thumbnailFile}
                setThumbnailFile={setThumbnailFile}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                setActiveTab={setActiveTab}
              />
              
              <VisibilityTab 
                form={form}
                setActiveTab={setActiveTab}
              />
              
              <AdvancedTab 
                form={form}
                setActiveTab={setActiveTab}
              />
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContentModal;
