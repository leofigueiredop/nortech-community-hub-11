import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Plus, Upload, ExternalLink, BarChart2, Layout, Settings } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { ContentItem, ContentFormat, Author } from '@/types/library';

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  format: z.enum(['audio', 'pdf', 'text', 'url', 'youtube', 'vimeo', 'gdoc', 'image', 'course', 'link', 'video']),
  accessLevel: z.enum(['free', 'premium', 'unlockable']),
  tags: z.string().optional(),
  author: z.string().optional(),
  duration: z.string().optional(),
  resourceUrl: z.string().optional(),
  featured: z.boolean().optional(),
  pointsEnabled: z.boolean().optional(),
  pointsValue: z.number().optional(),
});

const ContentCreatorDashboard: React.FC = () => {
  const { toast } = useToast();
  const { addContent } = useLibraryContent();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      format: "video",
      accessLevel: "free",
    },
  });
  
  // Handle thumbnail file change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date().toISOString();
    
    // Create new content item
    const newContent: ContentItem = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      format: values.format as ContentFormat,
      thumbnail: previewUrl || '/placeholder.svg',
      thumbnailUrl: previewUrl || '/placeholder.svg',
      // Handle the author field to support both string and Author type
      author: values.author ? values.author : "Anonymous",
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: now,
      updatedAt: now,
      views: 0,
      duration: parseInt(values.duration) || 0,
      accessLevel: values.accessLevel,
      featured: values.featured || false,
      resourceUrl: values.resourceUrl || '',
      pointsEnabled: values.pointsEnabled || false,
      pointsValue: values.pointsValue || 0,
    };
    
    // Add content to library
    addContent(newContent);
    
    // Show success toast
    toast({
      title: 'Content Created',
      description: 'Your content has been successfully created and published.',
    });
    
    // Reset form
    form.reset();
    setPreviewUrl(null);
  };
  
  // UI components
  return (
    <MainLayout title="Content Creator Dashboard">
      <div className="container py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Content Creator Dashboard</h2>
          <Button variant="outline" className="gap-2">
            <ExternalLink size={16} />
            View Live Site
          </Button>
        </div>
        
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Layout size={16} />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Content</CardTitle>
                <CardDescription>
                  Fill out the form below to create and publish new content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Content Title" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the title of your content.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                <SelectItem value="gdoc">GDoc</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="course">Course</SelectItem>
                                <SelectItem value="link">Link</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the format of your content.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Content Description"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Write a detailed description for your content.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="accessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="unlockable">Unlockable</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Set the access level for your content.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter tags separated by commas" {...field} />
                            </FormControl>
                            <FormDescription>
                              Add tags to help users find your content.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Content Author" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the name of the content author.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (seconds)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter duration in seconds" type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Specify the duration of the content in seconds.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="resourceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter resource URL" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide the URL where the content can be accessed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured</FormLabel>
                            <FormDescription>
                              Mark this content as featured.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pointsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Points Enabled</FormLabel>
                            <FormDescription>
                              Enable points for this content.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.getValues("pointsEnabled") && (
                      <FormField
                        control={form.control}
                        name="pointsValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Points Value</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter points value" type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Specify the points value for this content.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div>
                      <FormLabel>Thumbnail</FormLabel>
                      <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Thumbnail Preview"
                          className="mt-2 rounded-md"
                          style={{ maxWidth: '200px', maxHeight: '150px' }}
                        />
                      )}
                    </div>
                    
                    <Button type="submit">Create Content</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
                <CardDescription>
                  View analytics for your content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics content here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>
                  Manage settings for your content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ContentCreatorDashboard;
