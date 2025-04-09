
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, Eye, CheckCircle2, Clock } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { ContentFormatIcon } from './management/utils/ContentFormatIcon';
import { Progress } from '@/components/ui/progress';
import { useContentProgress } from '@/hooks/useContentProgress';

interface ContentCardProps {
  item: ContentItem;
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  const { getContentProgress } = useContentProgress();
  const progress = getContentProgress(item.id);
  
  const getFormatLabel = () => {
    switch (item.format) {
      case 'video':
        return 'Video';
      case 'pdf':
        return 'PDF';
      case 'audio':
        return 'Audio';
      case 'link':
        return 'Link';
      case 'image':
        return 'Image';
      case 'text':
        return 'Text';
      case 'course':
        return 'Course';  
      default:
        return String(item.format).charAt(0).toUpperCase() + String(item.format).slice(1);
    }
  };

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow border border-slate-200"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-video relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img 
            src={item.thumbnailUrl || '/placeholder.svg'} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {item.accessLevel === 'premium' && (
              <Badge variant="secondary" className="bg-amber-500 text-white border-none">
                <Lock className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
            {progress?.completed && (
              <Badge variant="secondary" className="bg-green-500 text-white border-none">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
            {progress && !progress.completed && progress.progress > 0 && (
              <Badge variant="secondary" className="bg-blue-500 text-white border-none">
                <Clock className="h-3 w-3 mr-1" /> In Progress
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-slate-800/60 backdrop-blur-sm text-white border-none flex items-center gap-1">
              <ContentFormatIcon format={item.format} />
              <span>{getFormatLabel()}</span>
              {item.duration && <span className="ml-2 text-xs">{item.duration}</span>}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
      </CardContent>

      {progress && progress.progress > 0 && !progress.completed && (
        <div className="px-4 pb-2">
          <Progress value={progress.progress} className="h-1" />
          <p className="text-xs text-muted-foreground text-right mt-1">{progress.progress}%</p>
        </div>
      )}

      <CardFooter className="border-t pt-3 pb-3 flex justify-between items-center">
        <div className="flex gap-1 flex-wrap">
          {item.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Eye size={14} className="mr-1" />
          <span>{item.views.toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
