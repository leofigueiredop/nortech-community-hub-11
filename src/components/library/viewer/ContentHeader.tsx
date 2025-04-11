
import React from 'react';
import { ContentItem } from '@/types/library';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration, getContentTypeName } from './contentViewerUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface ContentHeaderProps {
  item: ContentItem;
  onBack?: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item, onBack }) => {
  // Format the creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get author display
  const getAuthorDisplay = () => {
    if (typeof item.author === 'string') {
      return item.author;
    } else if (item.author && typeof item.author === 'object') {
      return item.author.name;
    }
    return 'Unknown Author';
  };

  // Get author avatar
  const getAuthorAvatar = () => {
    if (typeof item.author === 'object' && item.author && item.author.avatar) {
      return item.author.avatar;
    }
    return null;
  };

  return (
    <div className="mb-6">
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 p-0 h-8" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Back</span>
        </Button>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={getAuthorAvatar() || ''} alt={getAuthorDisplay()} />
          <AvatarFallback>{getAuthorDisplay().charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{getAuthorDisplay()}</div>
          <div className="text-xs text-muted-foreground">
            Published {formatDate(item.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge variant="outline" className="bg-primary/10">
          {getContentTypeName(item.format)}
        </Badge>
        
        {item.duration > 0 && (
          <Badge variant="outline" className="bg-muted">
            {formatDuration(item.duration)}
          </Badge>
        )}
        
        {item.accessLevel === 'premium' && (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600">
            Premium
          </Badge>
        )}
        
        {item.pointsEnabled && (
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
            {item.pointsValue} Points
          </Badge>
        )}
        
        {item.tags && item.tags.slice(0, 2).map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ContentHeader;
