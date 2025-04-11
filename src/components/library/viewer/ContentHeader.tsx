
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Lock, Trophy, MessageSquare, User, Download } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ContentHeaderProps {
  item: ContentItem;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Badge 
        variant={item.accessLevel === 'premium' ? 'default' : 'outline'}
        className={item.accessLevel === 'premium' ? 'bg-amber-500 hover:bg-amber-600 border-none text-white' : ''}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300">
                <Trophy size={12} className="mr-1" /> {item.pointsValue} pts
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Complete to earn {item.pointsValue} points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {item.format === 'pdf' && item.fileSize && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Download size={12} className="mr-1" /> {item.fileSize}
        </Badge>
      )}
      
      {item.allowComments && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <MessageSquare size={12} className="mr-1" /> Comments
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comments are enabled for this content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <div className="flex-grow"></div>
      
      <span className="text-muted-foreground text-sm flex items-center">
        <Calendar className="inline h-3 w-3 mr-1" />
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </span>
      
      <span className="text-muted-foreground text-sm flex items-center">
        <Eye className="inline h-3 w-3 mr-1" />
        {item.views.toLocaleString()}
      </span>
      
      {item.duration && (
        <span className="text-muted-foreground text-sm flex items-center">
          <Clock className="inline h-3 w-3 mr-1" />
          {item.duration}
        </span>
      )}
      
      {item.author && (
        <span className="text-muted-foreground text-sm flex items-center">
          <User className="inline h-3 w-3 mr-1" />
          {item.author}
        </span>
      )}
    </div>
  );
};

export default ContentHeader;
