
import React from 'react';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Music, Download, ExternalLink, BookOpen, Clock, Eye } from 'lucide-react';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';
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
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <Play size={16} className="mr-2" /> Assistir Agora
          </Button>
        );
      case 'pdf':
      case 'text':
      case 'gdoc':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <FileText size={16} className="mr-2" /> Ler Agora
          </Button>
        );
      case 'audio':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <Music size={16} className="mr-2" /> Ouvir Agora
          </Button>
        );
      case 'course':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <BookOpen size={16} className="mr-2" /> Iniciar Curso
          </Button>
        );
      default:
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <ExternalLink size={16} className="mr-2" /> Ver Agora
          </Button>
        );
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/90 via-black/70 to-black/20">
      {/* Content metadata */}
      <div className="flex justify-between items-start">
        <Badge className="bg-primary/80">{item.format.charAt(0).toUpperCase() + item.format.slice(1)}</Badge>
        
        {item.duration && (
          <Badge variant="outline" className="border-white/30 text-white/90">
            <Clock size={12} className="mr-1" />
            {formatDuration(item.duration)}
          </Badge>
        )}
      </div>
      
      {/* Content description and info shown on hover */}
      <div className="mt-auto space-y-2">
        <motion.h3 
          className="text-base sm:text-lg font-semibold text-white mb-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.title}
        </motion.h3>
        
        <motion.p 
          className="text-xs text-white/80 mb-3 line-clamp-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {item.description}
        </motion.p>
        
        <motion.div className="flex items-center text-xs text-white/70 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <Eye size={12} className="mr-1" />
          {item.views} visualizações
          
          {item.tags && item.tags.length > 0 && (
            <div className="ml-3 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-white/20 text-white/80">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="pt-1"
        >
          {getCTA()}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentFreeOverlay;
