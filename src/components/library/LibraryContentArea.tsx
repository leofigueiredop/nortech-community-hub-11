import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, BookOpen, FileText, User, Clock, Video, CheckCircle } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  format: string;
  access_level?: string;
  author?: string;
  tags?: string[];
  duration?: number;
  created_at?: string;
  updated_at?: string;
  points_value?: number;
  content_url?: string;
  is_featured?: boolean;
}

interface LibraryContentAreaProps {
  isSearchActive: boolean;
  filteredContent: ContentItem[];
  searchQuery: string;
  activeView: 'all' | 'free' | 'premium' | 'unlockable';
  featuredContent: ContentItem[];
  content: ContentItem[];
  visitedTags: string[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContentArea: React.FC<LibraryContentAreaProps> = ({
  isSearchActive,
  filteredContent = [],
  searchQuery = '',
  activeView = 'all',
  featuredContent = [],
  content = [],
  visitedTags = [],
  onItemSelect
}) => {
  
  // Format the duration in minutes:seconds
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Get format icon based on content type
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get access level badge styling
  const getAccessBadge = (level?: string) => {
    if (!level) return <Badge variant="outline">Unknown</Badge>;
    
    switch (level.toLowerCase()) {
      case 'free':
        return <Badge variant="outline" className="border-green-500 text-green-600">Free</Badge>;
      case 'premium':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>;
      case 'unlockable':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Unlockable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Placeholder image URL - using a more reliable service
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3C/svg%3E";
  };
  
  // Featured section (only show if not searching)
  const renderFeaturedSection = () => {
    if (isSearchActive || !featuredContent || featuredContent.length === 0) return null;
    
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredContent.slice(0, 3).map(item => (
            <Card 
              key={item.id}
              className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => onItemSelect(item)}
            >
              <div className="aspect-video relative">
                {item.thumbnail_url ? (
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage();
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {getAccessBadge(item.access_level)}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDuration(item.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" className="gap-1">
                    <PlayCircle className="h-4 w-4" />
                    Watch Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  };
  
  // Main content grid
  const renderContentGrid = () => {
    const contentToDisplay = isSearchActive ? filteredContent : filteredContent;
    
    if (!contentToDisplay || contentToDisplay.length === 0) {
      return (
        <div className="bg-muted/40 p-12 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {isSearchActive 
              ? `No results for "${searchQuery}". Try a different search term.` 
              : "There's no content available in this category yet."}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {contentToDisplay.map(item => (
          <Card 
            key={item.id}
            className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => onItemSelect(item)}
          >
            <div className="aspect-video relative bg-muted">
              {item.thumbnail_url ? (
                <img 
                  src={item.thumbnail_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage();
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getFormatIcon(item.format)}
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {getAccessBadge(item.access_level)}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium line-clamp-2">{item.title}</h3>
                <div className="flex-shrink-0 mt-1">
                  {getFormatIcon(item.format)}
                </div>
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDuration(item.duration)}</span>
                </div>
                
                {item.author && typeof item.author === 'string' && (
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {item.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{item.author}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container p-6">
      {renderFeaturedSection()}
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {isSearchActive 
            ? `Search Results (${filteredContent ? filteredContent.length : 0})` 
            : activeView === 'all' 
              ? 'All Content' 
              : `${activeView.charAt(0).toUpperCase() + activeView.slice(1)} Content`}
        </h2>
      </div>
      
      {renderContentGrid()}
    </div>
  );
};

export default LibraryContentArea;
