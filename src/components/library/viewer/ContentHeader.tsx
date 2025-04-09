
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Lock, Trophy, MessageSquare, User } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';

interface ContentHeaderProps {
  item: ContentItem;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Badge 
        variant={item.accessLevel === 'premium' ? 'default' : 'outline'}
        className={item.accessLevel === 'premium' ? 'bg-amber-500 hover:bg-amber-600 border-none' : ''}
      >
        {item.accessLevel === 'premium' ? (
          <>
            <Lock size={12} className="mr-1" /> Premium
          </>
        ) : (
          'Free'
        )}
      </Badge>
      
      {item.pointsEnabled && (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300">
          <Trophy size={12} className="mr-1" /> {item.pointsValue} pts
        </Badge>
      )}
      
      {item.allowComments && (
        <Badge variant="outline">
          <MessageSquare size={12} className="mr-1" /> Comments Enabled
        </Badge>
      )}
      
      <span className="text-muted-foreground text-sm">
        <Calendar className="inline h-3 w-3 mr-1" />
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </span>
      
      <span className="text-muted-foreground text-sm">
        <Eye className="inline h-3 w-3 mr-1" />
        {item.views.toLocaleString()} views
      </span>
      
      {item.duration && (
        <span className="text-muted-foreground text-sm">
          <Clock className="inline h-3 w-3 mr-1" />
          {item.duration}
        </span>
      )}
      
      {item.author && (
        <span className="text-muted-foreground text-sm">
          <User className="inline h-3 w-3 mr-1" />
          {item.author}
        </span>
      )}
    </div>
  );
};

export default ContentHeader;
