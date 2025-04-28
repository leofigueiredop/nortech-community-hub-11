
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { TagInput } from '@/components/ui/tag-input';
import { useUser } from '@/hooks/use-user';
import { Discussion, DiscussionTopic } from '@/types/discussion';

interface CreateDiscussionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: DiscussionTopic;
  onDiscussionCreated?: () => void;
}

const formats = [
  { value: 'discussion', label: 'Discussion' },
  { value: 'question', label: 'Question' },
];

const createDiscussion = async (discussion: Partial<Discussion>) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(discussion);
    }, 500);
  });
};

export default function CreateDiscussionDialog({
  open,
  onOpenChange,
  topic,
  onDiscussionCreated
}: CreateDiscussionDialogProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedFormat, setSelectedFormat] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !selectedFormat) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create discussion object
    const newDiscussion: Partial<Discussion> = {
      title,
      content: description,
      topic_id: topic.id,
      format: selectedFormat as 'question' | 'discussion',
      tags: selectedTags,
      community_id: topic.community_id,
      is_locked: false,
      is_featured: false,
      is_anonymous: false,
      votes: 0,
      view_count: 0,
      author: {
        id: user.id,
        name: user.display_name || user.email.split('@')[0],
        avatar: user.avatar_url, // Changed from avatar_url to avatar
        level: 1, // Default values for compatibility
        xp: 0 // Default values for compatibility
      }
    };
    
    // Mock API call
    createDiscussion(newDiscussion)
      .then(() => {
        toast({
          title: "Discussion created",
          description: "Your discussion has been created successfully",
        });
        onDiscussionCreated?.();
        onOpenChange(false);
        resetForm();
      })
      .catch((error) => {
        toast({
          title: "Error creating discussion",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFormat('');
    setSelectedTags([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
          <DialogDescription>
            Start a new discussion in <strong>{topic.title}</strong> topic.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's this discussion about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Elaborate more on your discussion..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput
              id="tags"
              tags={selectedTags}
              onTagsChange={setSelectedTags}
              placeholder="Add some tags..."
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Discussion</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
