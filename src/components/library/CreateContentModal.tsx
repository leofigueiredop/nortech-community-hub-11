
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Upload, Calendar, Trophy, FileText } from 'lucide-react';
import { ContentItem, ContentFormat } from '@/types/library';
import { ContentFormatOptions } from './management/constants/contentFormOptions';
import FileUploader from './management/form/FileUploader';
import TagsInput from './management/form/TagsInput';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  format: z.string().min(1, "Format is required"),
  accessLevel: z.enum(["free", "premium", "unlockable"]),
  pointsEnabled: z.boolean().default(false),
  pointsValue: z.number().default(100),
  featured: z.boolean().default(false),
  addToCarousel: z.boolean().default(false),
  linkToCourse: z.string().optional(),
  scheduleDate: z.string().optional(),
  attachToChallenge: z.string().optional(),
  internalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateContentModal: React.FC<CreateContentModalProps> = ({ isOpen, onClose }) => {
  const { addContent, allTags } = useLibraryContent();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    
    const newContent: ContentItem = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      format: values.format as ContentFormat,
      resourceUrl: file ? `mock-file-path/${file.name}` : '',
      thumbnailUrl: previewImage || '/placeholder.svg',
      tags: selectedTags,
      accessLevel: values.accessLevel === 'unlockable' ? 'premium' : values.accessLevel,
      createdAt: now,
      updatedAt: now,
      views: 0,
      featured: values.featured,
      pointsEnabled: values.accessLevel === 'unlockable' || values.pointsEnabled,
      pointsValue: values.pointsValue,
      visibility: values.accessLevel as any,
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
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter a short description" className="h-24" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
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
                    </FormItem>
                  )}
                />
                
                <div>
                  <TagsInput
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    allTags={allTags}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab('media')} disabled={!isBasicInfoValid}>
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FileUploader
                      label="Content File"
                      onFileChange={setFile}
                      id="content-file"
                      placeholder="Drag & drop or click to upload"
                      helpText={`Upload your ${form.watch('format')} file`}
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
                      helpText="PNG, JPG or GIF (recommended 16:9)"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('visibility')}>
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="visibility" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
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
                          <SelectItem value="free">Free (Available to everyone)</SelectItem>
                          <SelectItem value="premium">Premium (For subscribers only)</SelectItem>
                          <SelectItem value="unlockable">Unlockable (With points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                {form.watch('accessLevel') === 'unlockable' && (
                  <FormField
                    control={form.control}
                    name="pointsValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points Cost</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          How many points users need to unlock this content
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
                
                {form.watch('accessLevel') !== 'unlockable' && (
                  <>
                    <FormField
                      control={form.control}
                      name="pointsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">XP Reward</FormLabel>
                            <FormDescription>
                              Award XP points when users complete this content
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('pointsEnabled') && (
                      <FormField
                        control={form.control}
                        name="pointsValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>XP Amount</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Feature on Home</FormLabel>
                        <FormDescription>
                          Highlight this content on the main library page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="addToCarousel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Add to Carousel</FormLabel>
                        <FormDescription>
                          Include this content in the featured carousel
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('media')}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('advanced')}>
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <FormLabel>Schedule Publish Date (Optional)</FormLabel>
                      </div>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to publish immediately
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="attachToChallenge"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <FormLabel>Attach to Challenge (Optional)</FormLabel>
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a challenge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="challenge-1">Beginner Developer Path</SelectItem>
                          <SelectItem value="challenge-2">AI Mastery Challenge</SelectItem>
                          <SelectItem value="challenge-3">Community Expert Badge</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <FormLabel>Internal Notes (Not visible to users)</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea className="h-24" placeholder="Add private notes for team members" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('visibility')}>
                    Back
                  </Button>
                  <Button type="submit">
                    Create Content
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContentModal;
