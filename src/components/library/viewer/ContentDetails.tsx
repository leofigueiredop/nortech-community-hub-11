
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContentItem } from '@/types/library';
import { Calendar, Clock, User, Download, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { getContentTypeFromUrl } from './contentViewerUtils';

interface ContentDetailsProps {
  item: ContentItem;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ item }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <Badge key={tag} variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {item.fileSize && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Download className="h-4 w-4 mr-2" />
              File size: {item.fileSize}
            </div>
          )}
          
          {item.duration && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Duration: {item.duration}
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Created: {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Updated: {format(new Date(item.updatedAt), 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Content Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            Author: {item.author || 'Unknown'}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            Format: {getContentTypeFromUrl(item.resourceUrl)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetails;
