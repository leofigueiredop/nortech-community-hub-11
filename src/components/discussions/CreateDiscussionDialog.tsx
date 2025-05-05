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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !selectedFormat) {
      toast({
        title: t('discussions.createDiscussionDialog.missingFields'),
        description: t('discussions.createDiscussionDialog.fillAllFields'),
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
          title: t('discussions.createDiscussionDialog.success'),
          description: t('discussions.createDiscussionDialog.successMessage'),
        });
        onDiscussionCreated?.();
        onOpenChange(false);
        resetForm();
      })
      .catch((error) => {
        toast({
          title: t('discussions.createDiscussionDialog.error'),
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
          <DialogTitle>{t('discussions.createDiscussionDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('discussions.createDiscussionDialog.description', { topic: topic.title })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('discussions.createDiscussionDialog.titleLabel')}</Label>
            <Input
              id="title"
              placeholder={t('discussions.createDiscussionDialog.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('discussions.createDiscussionDialog.descriptionLabel')}</Label>
            <Textarea
              id="description"
              placeholder={t('discussions.createDiscussionDialog.descriptionPlaceholder')}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="format">{t('discussions.createDiscussionDialog.formatLabel')}</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder={t('discussions.createDiscussionDialog.formatPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="discussion" value="discussion">
                  {t('discussions.createDiscussionDialog.formatDiscussion')}
                </SelectItem>
                <SelectItem key="question" value="question">
                  {t('discussions.createDiscussionDialog.formatQuestion')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">{t('discussions.createDiscussionDialog.tagsLabel')}</Label>
            <TagInput
              id="tags"
              tags={selectedTags}
              onTagsChange={setSelectedTags}
              placeholder={t('discussions.createDiscussionDialog.tagsPlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{t('discussions.createDiscussionDialog.create')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
