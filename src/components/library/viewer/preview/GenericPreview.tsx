
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { FileText, Lock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface GenericPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
}

const GenericPreview: React.FC<GenericPreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false 
}) => {
  const isPremium = item.accessLevel === 'premium';

  return (
    <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-video'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden`}>
      <motion.div 
        className="text-center z-10 p-8 backdrop-blur-sm bg-white/10 dark:bg-black/20 rounded-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-200 dark:bg-slate-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
        >
          <FileText size={32} className="text-slate-600 dark:text-slate-300" />
        </motion.div>
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-6">This content requires access to view</p>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleAccess} 
            className="px-6"
            size="lg"
          >
            {isPremium ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" /> Access Content
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
      
      {isPremium && (
        <PremiumContentOverlay 
          pointsEnabled={item.pointsEnabled}
          pointsValue={item.pointsValue}
          freeAccessLeft={item.freeAccessesLeft}
          onSubscribe={handleAccess}
          onUsePoints={handleAccess}
        />
      )}
    </div>
  );
};

export default GenericPreview;
