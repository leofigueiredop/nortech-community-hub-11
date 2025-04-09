
import React from 'react';
import { ContentItem } from '@/types/library';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileVideo, Lock, Play } from 'lucide-react';

interface FeaturedContentProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ items, onItemSelect }) => {
  if (items.length === 0) return null;

  // Use the first featured item
  const featured = items[0];

  return (
    <div className="mb-10">
      <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white overflow-hidden border-none">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/5 relative">
            <div className="aspect-video md:aspect-auto md:h-full relative overflow-hidden">
              <img 
                src={featured.thumbnailUrl || '/placeholder.svg'} 
                alt={featured.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
            </div>
            
            <Button 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black hover:bg-white/90 h-16 w-16 rounded-full flex items-center justify-center"
              onClick={() => onItemSelect(featured)}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
          
          <CardContent className="p-6 md:w-2/5 flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <Badge className="bg-nortech-purple/80 hover:bg-nortech-purple">
                <FileVideo size={14} className="mr-1" /> Featured
              </Badge>
              {featured.accessLevel === 'premium' && (
                <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500">
                  <Lock size={12} className="mr-1" /> Premium
                </Badge>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{featured.title}</h2>
            <p className="text-gray-300 mb-6">{featured.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Button 
              className="bg-nortech-purple hover:bg-nortech-purple/90 w-full sm:w-auto"
              onClick={() => onItemSelect(featured)}
            >
              Watch Now
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default FeaturedContent;
