import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Pin, Lock, Tag, Users, MessageSquare, TrendingUp, PieChart } from 'lucide-react';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import { useAuth } from '@/context/AuthContext';

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopicCreated?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().optional(),
  color: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_private: z.boolean().default(false),
  access_level: z.enum(['free', 'premium']).default('free'),
});

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({
  open,
  onOpenChange,
  onTopicCreated
}) => {
  const { createTopic } = useRealDiscussions();
  const { user, community } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: 'message-square',
      color: '#6941C6',
      is_featured: false,
      is_private: false,
      access_level: 'free',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a topic',
        variant: 'destructive',
      });
      return;
    }

    if (!community) {
      toast({
        title: 'Community Required',
        description: 'Please select a community first',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a slug from the title
      const slug = values.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      const result = await createTopic({
        title: values.title,
        description: values.description,
        icon: values.icon,
        color: values.color,
        is_featured: values.is_featured,
        is_private: values.is_private,
        access_level: values.access_level,
        slug,
        community_id: community.id,
      });
      
      if (result) {
        toast({
          title: 'Topic Created',
          description: 'Your discussion topic has been created',
        });
        
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
        
        // Call the callback if provided
        if (onTopicCreated) {
          onTopicCreated();
        }
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: 'Error',
        description: 'Failed to create topic',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconOptions = [
    { value: 'message-square', label: 'Discussion', icon: <MessageSquare size={16} /> },
    { value: 'users', label: 'Users', icon: <Users size={16} /> },
    { value: 'trending-up', label: 'Trending', icon: <TrendingUp size={16} /> },
    { value: 'pie-chart', label: 'Chart', icon: <PieChart size={16} /> },
  ];

  const colorOptions = [
    { value: '#6941C6', label: 'Purple' },
    { value: '#3538CD', label: 'Blue' },
    { value: '#099250', label: 'Green' },
    { value: '#C11574', label: 'Pink' },
    { value: '#B42318', label: 'Red' },
    { value: '#B54708', label: 'Orange' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Discussion Topic</DialogTitle>
          <DialogDescription>
            Create a new topic area for discussions in your community
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., General Discussion, Technical Support, Feature Requests" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and descriptive title for the topic
                  </FormDescription>
                  <FormMessage />
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
                    <Textarea 
                      placeholder="Describe what this topic is about..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide more details about the topic's purpose
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select 
                      defaultValue={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center"
                          >
                            <div className="flex items-center">
                              {option.icon}
                              <span className="ml-2">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose an icon for the topic
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select 
                      defaultValue={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center"
                          >
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2" 
                                style={{ backgroundColor: option.value }}
                              />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a color for the topic
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        <Pin size={14} className="mr-1" /> 
                        Featured Topic
                      </FormLabel>
                      <FormDescription>
                        Featured topics appear prominently in the forum
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        <Lock size={14} className="mr-1" /> 
                        Private Topic
                      </FormLabel>
                      <FormDescription>
                        Private topics are only visible to specific members
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Topic'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
