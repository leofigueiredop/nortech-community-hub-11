
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DiscussionTopic } from '@/types/discussion';
import { useDiscussions } from '@/hooks/useDiscussions';

interface CreateTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (topic: DiscussionTopic) => void;
}

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createTopic } = useDiscussions();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Topic title is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new topic with required field title
      const newTopic: Omit<DiscussionTopic, 'id' | 'created_at' | 'updated_at' | 'discussionCount' | 'memberCount' | 'recentActivity'> = {
        title: title,
        description: description,
        community_id: 'default',
        icon: 'MessageSquare',
        color: '#6366f1',
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        is_featured: false,
        is_private: false,
        access_level: 'free'
      };
      
      const createdTopic = await createTopic(newTopic);
      
      toast({
        title: "Success",
        description: "Topic created successfully"
      });
      
      if (onSuccess) {
        onSuccess(createdTopic);
      }
      
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>
              Create a new discussion topic for the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Topic Name</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter topic name"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
