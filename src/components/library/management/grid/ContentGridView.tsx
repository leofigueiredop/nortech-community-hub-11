
import React from 'react';
import { ContentItem } from '@/types/library';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentFormatIcon } from '../utils/ContentFormatIcon';
import { ContentItemActions } from './ContentItemActions';
import { Eye, Lock } from 'lucide-react';

interface ContentGridViewProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}

const ContentGridView: React.FC<ContentGridViewProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  onClone 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
            <img 
              src={item.thumbnailUrl || '/placeholder.svg'} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.accessLevel === 'premium' && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-amber-500 text-white">
                  <Lock size={12} className="mr-1" /> Premium
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-1 line-clamp-1">{item.title}</h3>
                <div className="flex items-center text-xs text-slate-500 mb-2">
                  <ContentFormatIcon format={item.format} />
                  <span className="ml-1">{item.format.toUpperCase()}</span>
                  <span className="mx-1">•</span>
                  <Eye size={12} className="mr-1" />
                  {item.views.toLocaleString()}
                </div>
              </div>
              <ContentItemActions 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onClone={onClone}
              />
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentGridView;
