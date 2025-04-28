
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { adaptLibraryToContentType } from '@/utils/contentTypeAdapter';

interface FeaturedContentProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ items, onItemSelect }) => {
  if (!items.length) return null;
  
  const featured = items[0];
  
  return (
    <motion.div 
      className="relative w-full rounded-xl overflow-hidden aspect-[21/9]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${featured.thumbnail || featured.thumbnailUrl || '/placeholder.svg'})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
        <h3 className="text-white text-2xl md:text-3xl font-bold">{featured.title}</h3>
        <p className="text-gray-300 mt-2 mb-4 max-w-2xl line-clamp-2">{featured.description}</p>
        
        <Button 
          className="gap-2 w-fit"
          onClick={() => onItemSelect(featured)}
        >
          <PlayCircle className="h-5 w-5" />
          Watch Now
        </Button>
      </div>
    </motion.div>
  );
};

export default FeaturedContent;
