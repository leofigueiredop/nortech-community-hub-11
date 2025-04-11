
import React from 'react';
import { ContentItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Share2, Bookmark, Flag, LucideIcon, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';

interface ContentHeaderProps {
  item: ContentItem;
  onBack: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item, onBack }) => {
  // Function to render author
  const renderAuthor = () => {
    if (typeof item.author === 'string') {
      return (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">By:</span>
          <span className="text-sm font-medium ml-1">{item.author}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-1">By:</span>
          <Avatar className="h-5 w-5 mr-1">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{item.author.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col mb-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Badge className="mr-2 capitalize bg-primary/90 text-primary-foreground">
              <ContentFormatIcon format={item.format} size={14} className="mr-1 text-white" />
              {item.format}
            </Badge>
            
            {item.accessLevel === 'premium' && (
              <Badge className="bg-amber-500 text-white">
                <Lock size={12} className="mr-1" /> Premium
              </Badge>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
          
          <div className="flex flex-wrap items-center space-x-4">
            {renderAuthor()}
            
            {item.categoryId && (
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm font-medium ml-1">
                  {item.categoryId}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="ml-2"
        >
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 size={14} /> Share
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <Bookmark size={14} /> Save
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
          <Flag size={14} /> Report
        </Button>
      </div>
    </div>
  );
};

export default ContentHeader;
