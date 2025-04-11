
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  Calendar, 
  Eye, 
  ExternalLink, 
  FileText, 
  Download, 
  Tag,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContentDetailsProps {
  item: ContentItem;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ item }) => {
  const [showMore, setShowMore] = useState(false);
  
  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Function to render author
  const renderAuthor = () => {
    if (typeof item.author === 'string') {
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{item.author}</p>
            <p className="text-xs text-muted-foreground">Creator</p>
          </div>
        </div>
      );
    } else if (item.author && typeof item.author === 'object') {
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{item.author.name}</p>
            <p className="text-xs text-muted-foreground">Creator</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Content Details</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Published:</span>
                <span className="ml-1">
                  {formatDistanceToNow(new Date(item.createdAt))} ago
                </span>
              </li>
              <li className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-1">{formatDuration(item.duration)}</span>
              </li>
              <li className="flex items-center text-sm">
                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Views:</span>
                <span className="ml-1">{item.views.toLocaleString()}</span>
              </li>
              {item.resourceUrl && (
                <li className="flex items-center text-sm">
                  <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Source:</span>
                  <Button variant="link" size="sm" className="h-auto p-0 ml-1">
                    External Link
                  </Button>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Access Information</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-1 capitalize">{item.format}</span>
              </li>
              <li className="flex items-center text-sm">
                <Crown className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Access Level:</span>
                <span className="ml-1 capitalize">{item.accessLevel}</span>
              </li>
              {item.pointsEnabled && (
                <li className="flex items-center text-sm">
                  <span className="mr-2 text-muted-foreground">🔥</span>
                  <span className="text-muted-foreground">Points:</span>
                  <span className="ml-1">{item.pointsValue} points when completed</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="author">
          <AccordionTrigger>About the Creator</AccordionTrigger>
          <AccordionContent>
            <div className="p-2">
              {renderAuthor()}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {item.tags.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {["pdf", "audio"].includes(item.format) && (
        <div className="pt-2">
          <Button className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download {item.format.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentDetails;
