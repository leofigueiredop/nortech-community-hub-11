import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DiscussionTopic } from '@/types/discussion';
import { useDiscussions } from '@/hooks/useDiscussions';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: t('discussions.createTopicDialog.error'),
        description: t('discussions.createTopicDialog.titleRequired'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new topic with required fields
      const newTopic = {
        title: title,
        description: description,
        community_id: 'default',
        icon: 'MessageSquare',
        color: '#6366f1',
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        is_featured: false,
        is_private: false,
        access_level: 'free' as 'free' | 'premium' | 'premium_plus',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const createdTopic = await createTopic(newTopic);
      
      toast({
        title: t('discussions.createTopicDialog.success'),
        description: t('discussions.createTopicDialog.successMessage')
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
        title: t('discussions.createTopicDialog.error'),
        description: t('discussions.createTopicDialog.failed'),
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
            <DialogTitle>{t('discussions.createTopicDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('discussions.createTopicDialog.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('discussions.createTopicDialog.topicName')}</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('discussions.createTopicDialog.topicNamePlaceholder')}
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t('discussions.createTopicDialog.topicDescription')}</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('discussions.createTopicDialog.topicDescriptionPlaceholder')}
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
              {t('discussions.createTopicDialog.cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? t('discussions.createTopicDialog.creating') : t('discussions.createTopicDialog.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
