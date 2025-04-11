
import React from 'react';
import { ContentItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Calendar, User, Tag, Eye, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContentDetailsProps {
  item: ContentItem;
  duration?: string;
  completionCriteria?: string;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ 
  item, 
  duration,
  completionCriteria 
}) => {
  const createdAt = new Date(item.createdAt);
  const formattedDate = formatDistanceToNow(createdAt, { 
    addSuffix: true,
    locale: ptBR
  });
  
  // Safely extract author name
  const authorName = typeof item.author === 'string' 
    ? item.author 
    : item.author?.name || 'Unknown';
  
  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Author: <span className="font-medium text-foreground">{authorName}</span></span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Published: <span className="font-medium text-foreground">{formattedDate}</span></span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>Views: <span className="font-medium text-foreground">{item.views || 0}</span></span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Duration: <span className="font-medium text-foreground">{duration || 'N/A'}</span></span>
        </div>
        
        {completionCriteria && (
          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <Award className="h-4 w-4" />
            <span>Completion: <span className="font-medium text-foreground">{completionCriteria}</span></span>
          </div>
        )}
        
        {item.format && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Format: <span className="font-medium text-foreground">{item.format.charAt(0).toUpperCase() + item.format.slice(1)}</span></span>
          </div>
        )}
        
        {item.pointsEnabled && item.pointsValue && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Earn <span className="font-medium text-amber-500">{item.pointsValue} points</span> when completed</span>
          </div>
        )}
      </div>
      
      {item.tags && item.tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Tag className="h-4 w-4" />
            <span>Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetails;
