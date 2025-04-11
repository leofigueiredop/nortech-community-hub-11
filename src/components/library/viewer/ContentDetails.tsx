
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContentItem } from '@/types/library';
import { 
  Calendar, 
  Clock, 
  User, 
  Download, 
  Tag, 
  ChevronDown,
  ChevronUp,
  FileText,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { getContentTypeFromUrl } from './contentViewerUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface ContentDetailsProps {
  item: ContentItem;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">About this content</h3>
        <div className={!isExpanded ? "line-clamp-3" : ""}>
          <p className="text-muted-foreground text-sm">{item.description}</p>
        </div>
        {item.description && item.description.length > 150 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-7 px-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Read more
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1 hover:bg-primary/10 transition-colors">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <Collapsible defaultOpen className="space-y-4">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <h3 className="font-medium">Content Details</h3>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 rounded-lg bg-muted/50 p-3">
            {item.fileSize && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Download className="h-4 w-4 mr-2 text-primary/70" />
                File size: {item.fileSize}
              </div>
            )}
            
            {item.duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-primary/70" />
                Duration: {item.duration}
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary/70" />
              Created: {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-2 text-primary/70" />
              Format: {getContentTypeFromUrl(item.resourceUrl)}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2 text-primary/70" />
              Author: {item.author || 'Unknown'}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-4 w-4 mr-2 text-primary/70" />
              Views: {item.views.toLocaleString()}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {item.pointsEnabled && (
        <>
          <Separator />
          <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
            <h3 className="font-medium mb-2 text-primary">Achievement</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Complete this content to earn {item.pointsValue} points and unlock rewards!
            </p>
            <div className="flex items-center justify-center">
              <Badge className="bg-primary text-white">
                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L8.5359 17.1524L9.33126 13.1762L6.66253 10.3476L10.268 9.67376L12 6L13.732 9.67376L17.3375 10.3476L14.6687 13.1762L15.4641 17.1524L12 15Z" fill="currentColor" />
                </svg>
                {item.pointsValue} Points
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentDetails;
