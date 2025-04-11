
import React from 'react';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Music, Download, ExternalLink, BookOpen, Clock, Eye } from 'lucide-react';
import { formatDuration } from '../viewer/contentViewerUtils';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  // Get the appropriate CTA based on content format
  const getCTA = () => {
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            <Play size={16} className="mr-2" /> Assistir Agora
          </Button>
        );
      case 'pdf':
      case 'text':
      case 'gdoc':
        return (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            <FileText size={16} className="mr-2" /> Ler Agora
          </Button>
        );
      case 'audio':
        return (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            <Music size={16} className="mr-2" /> Ouvir Agora
          </Button>
        );
      case 'course':
        return (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            <BookOpen size={16} className="mr-2" /> Iniciar Curso
          </Button>
        );
      default:
        return (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            <ExternalLink size={16} className="mr-2" /> Ver Agora
          </Button>
        );
    }
  };

  return (
    <div className="absolute inset-0 p-4 bg-gradient-to-t from-black via-black/80 to-black/50 flex flex-col justify-between">
      {/* Top section with format badge */}
      <div className="flex justify-between items-start">
        <Badge className="bg-primary/90">{item.format.charAt(0).toUpperCase() + item.format.slice(1)}</Badge>
        
        {item.duration && (
          <Badge variant="outline" className="border-white/30 text-white/90">
            <Clock size={12} className="mr-1" />
            {formatDuration(item.duration)}
          </Badge>
        )}
      </div>
      
      {/* Middle section with title and description */}
      <div className="space-y-2 mt-auto mb-3">
        <motion.h3 
          className="text-base font-semibold text-white line-clamp-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.title}
        </motion.h3>
        
        <motion.p 
          className="text-xs text-white/80 line-clamp-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {item.description}
        </motion.p>
      </div>
      
      {/* Bottom section with metadata and CTA */}
      <div className="space-y-2">
        <motion.div 
          className="flex items-center text-xs text-white/70"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Eye size={12} className="mr-1" />
          {item.views} visualizações
          
          {item.tags && item.tags.length > 0 && (
            <div className="ml-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 1).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-white/20 text-white/80">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          {getCTA()}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentFreeOverlay;
