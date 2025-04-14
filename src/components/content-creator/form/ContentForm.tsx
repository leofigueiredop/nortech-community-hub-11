
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { ContentItem } from '@/types/library';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import BasicInfoSection from './sections/BasicInfoSection';
import DescriptionSection from './sections/DescriptionSection';
import AccessSection from './sections/AccessSection';
import MetadataSection from './sections/MetadataSection';
import ResourceUrlSection from './sections/ResourceUrlSection';
import OptionsSection from './sections/OptionsSection';
import ThumbnailSection from './sections/ThumbnailSection';
import { formSchema, ContentFormValues } from '../FormSchema';

const ContentForm: React.FC = () => {
  const { toast } = useToast();
  const { addContent } = useLibraryContent();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      format: "video",
      accessLevel: "free",
    },
  });
  
  const onSubmit = (values: ContentFormValues) => {
    const now = new Date().toISOString();
    
    const newContent: ContentItem = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      format: values.format,
      thumbnail: previewUrl || '/placeholder.svg',
      thumbnailUrl: previewUrl || '/placeholder.svg',
      author: values.author ? values.author : "Anonymous",
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: now,
      updatedAt: now,
      views: 0,
      duration: parseInt(values.duration || '0') || 0,
      accessLevel: values.accessLevel,
      featured: values.featured || false,
      resourceUrl: values.resourceUrl || '',
      pointsEnabled: values.pointsEnabled || false,
      pointsValue: values.pointsValue || 0,
    };
    
    addContent(newContent);
    
    toast({
      title: 'Content Created',
      description: 'Your content has been successfully created and published.',
    });
    
    form.reset();
    setPreviewUrl(null);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <DescriptionSection form={form} />
        <AccessSection form={form} />
        <MetadataSection form={form} />
        <ResourceUrlSection form={form} />
        <OptionsSection form={form} />
        <ThumbnailSection setPreviewUrl={setPreviewUrl} previewUrl={previewUrl} />
        <Button type="submit">Create Content</Button>
      </form>
    </Form>
  );
};

export default ContentForm;
