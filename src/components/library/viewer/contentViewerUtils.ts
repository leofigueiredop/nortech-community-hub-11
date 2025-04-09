
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';

export const handleExternalContentAccess = (item: ContentItem | null, onContentView: () => void) => {
  if (!item) return;

  if (item.accessLevel === 'premium') {
    toast({
      title: 'Premium Content',
      description: 'This content requires a premium subscription.',
      variant: 'destructive',
    });
  } else {
    onContentView();
    
    toast({
      title: 'Opening Content',
      description: `Opening ${item.title}`,
    });
    window.open(item.resourceUrl, '_blank');
  }
};
