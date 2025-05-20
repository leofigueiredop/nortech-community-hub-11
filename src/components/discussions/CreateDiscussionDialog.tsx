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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MessageSquare, HelpCircle, BellRing } from 'lucide-react';
import { DiscussionTopic } from '@/types/discussion';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import { useAuth } from '@/context/AuthContext';

interface CreateDiscussionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: DiscussionTopic;
  onDiscussionCreated?: () => void;
}

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  format: z.enum(['discussion', 'question', 'announcement']),
  tags: z.string().optional(),
});

const CreateDiscussionDialog: React.FC<CreateDiscussionDialogProps> = ({
  open,
  onOpenChange,
  topic,
  onDiscussionCreated
}) => {
  const { createDiscussion, loading } = useRealDiscussions();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      format: 'discussion',
      tags: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a discussion',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse tags from comma-separated string to array
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];
      
      const result = await createDiscussion({
        topic_id: topic.id,
        title: values.title,
        content: values.content,
        format: values.format,
        tags: tagsArray,
      });
      
      if (result) {
        toast({
          title: 'Discussion Created',
          description: 'Your discussion has been posted',
        });
        
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
        
        // Call the callback if provided
        if (onDiscussionCreated) {
          onDiscussionCreated();
        }
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create discussion',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'question':
        return <HelpCircle className="w-4 h-4 mr-2" />;
      case 'announcement':
        return <BellRing className="w-4 h-4 mr-2" />;
      default:
        return <MessageSquare className="w-4 h-4 mr-2" />;
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be signed in to create a discussion.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Discussion</DialogTitle>
          <DialogDescription>
            Create a new discussion in {topic.title || topic.name}
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
                      placeholder="Enter a title for your discussion" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Keep it concise and descriptive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your discussion content here..." 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details, context, or your question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      defaultValue={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type">
                            {field.value && (
                              <div className="flex items-center">
                                {getFormatIcon(field.value)}
                                <span>
                                  {field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                                </span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="discussion">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Discussion
                          </div>
                        </SelectItem>
                        <SelectItem value="question">
                          <div className="flex items-center">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Question
                          </div>
                        </SelectItem>
                        <SelectItem value="announcement">
                          <div className="flex items-center">
                            <BellRing className="w-4 h-4 mr-2" />
                            Announcement
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the type of your post
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
                      <Input 
                        placeholder="tag1, tag2, tag3" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of tags
                    </FormDescription>
                    <FormMessage />
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
                disabled={isSubmitting || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Discussion'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDiscussionDialog;
