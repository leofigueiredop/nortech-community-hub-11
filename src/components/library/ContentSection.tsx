
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Clock, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ContentItem } from '@/types/library';
import { ContentFormatIcon } from './management/utils/ContentFormatIcon';

interface ContentSectionProps {
  items: ContentItem[];
  title: string;
  description?: string;
  viewAll?: string;
  onItemSelect?: (item: ContentItem) => void;
  isTopTen?: boolean;
  viewAllUrl?: string;
  showNewBadge?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  items,
  title,
  description,
  viewAll,
  onItemSelect,
  isTopTen = false,
  viewAllUrl,
  showNewBadge = false,
}) => {
  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (item: ContentItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <section className="py-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {(viewAll || viewAllUrl) && (
          <Link to={viewAllUrl || viewAll || "#"} className="text-sm text-primary hover:underline">
            View all
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn("overflow-hidden transition-all cursor-pointer", 
              item.is_featured && "border-primary/30 bg-primary/5"
            )}
            onClick={() => handleItemClick(item)}
          >
            <div className="relative">
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <Badge 
                  className={cn(
                    "flex items-center gap-1",
                    item.access_level === "premium" && "bg-amber-500", 
                    item.access_level === "premium_plus" && "bg-purple-500"
                  )}
                >
                  {item.access_level === "free" ? (
                    <>Free</>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      {item.access_level === "premium" ? "Premium" : "Premium+"}
                    </>
                  )}
                </Badge>
                
                <ContentFormatIcon format={item.format} />
                
                {item.pointsEnabled && item.pointsValue ? (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-0">
                    {item.pointsValue} pts
                  </Badge>
                ) : null}
                
                {/* Only use isNew if showNewBadge is true */}
                {showNewBadge && (
                  <Badge className="bg-blue-500">New</Badge>
                )}
              </div>
            </div>

            <CardHeader className="p-4 pb-0">
              <h3 className="font-semibold line-clamp-2">{item.title}</h3>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-wrap text-xs text-muted-foreground gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{item.views}</span>
              </div>

              {item.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.floor(item.duration / 60)} min</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(item.created_at)}</span>
              </div>

              <div className="flex gap-1 ml-auto items-center">
                {typeof item.author === 'string' ? (
                  <span>{item.author}</span>
                ) : (
                  item.author && (
                    <div className="flex items-center gap-1">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={item.author?.avatar} />
                        <AvatarFallback className="text-[8px]">
                          {item.author?.name ? item.author.name[0] : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[100px]">{item.author?.name || 'Unknown'}</span>
                    </div>
                  )
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ContentSection;
