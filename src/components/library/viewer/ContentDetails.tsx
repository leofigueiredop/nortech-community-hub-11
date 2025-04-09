
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContentItem } from '@/types/library';

interface ContentDetailsProps {
  item: ContentItem;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ item }) => {
  return (
    <div className="space-y-4">
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
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {item.fileSize && (
        <>
          <Separator />
          <div>
            <h3 className="font-medium mb-2">Details</h3>
            <p className="text-sm text-muted-foreground">File size: {item.fileSize}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentDetails;
