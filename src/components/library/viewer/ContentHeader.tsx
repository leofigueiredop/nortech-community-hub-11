
import React from 'react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Bookmark,
  Crown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ContentHeaderProps {
  item: ContentItem;
  onBack: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item, onBack }) => {
  // Function to render author
  const renderAuthor = () => {
    if (typeof item.author === 'string') {
      return (
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{item.author}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{item.author.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="border-b pb-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        
        <div className="flex items-center gap-2">
          {item.accessLevel === 'premium' && (
            <Badge variant="secondary" className="bg-amber-500 text-white">
              <Crown className="h-3 w-3 mr-1" /> Premium
            </Badge>
          )}
          {item.format && (
            <Badge variant="outline">
              {item.format.charAt(0).toUpperCase() + item.format.slice(1)}
            </Badge>
          )}
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
      
      <div className="text-sm text-muted-foreground mb-4">
        {item.description}
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        <div className="flex items-center gap-4">
          {renderAuthor()}
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{Math.floor(item.duration / 60)}m</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">Like</span>
          </Button>
          
          {/* Only show comments button if allowed */}
          {item.allowComments !== false && (
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Comment</span>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Bookmark className="h-4 w-4 mr-1" />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
