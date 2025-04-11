
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles } from 'lucide-react';

interface PremiumContentOverlayProps {
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessLeft?: number;
  onSubscribe: () => void;
  onUsePoints?: () => void;
}

const PremiumContentOverlay: React.FC<PremiumContentOverlayProps> = ({
  pointsEnabled = false,
  pointsValue = 150,
  freeAccessLeft = 0,
  onSubscribe,
  onUsePoints,
}) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 flex flex-col items-center justify-center p-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 max-w-md text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-16 h-16 bg-amber-500/90 rounded-full flex items-center justify-center mb-3">
          <Lock className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-1">Premium Content</h3>
        <p className="text-white/80 mb-6">Subscribe to unlock this content and gain access to our entire premium library.</p>
        
        <div className="space-y-3 w-full">
          <Button 
            onClick={onSubscribe}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2"
            size="lg"
          >
            <Crown className="h-5 w-5" />
            Subscribe for Full Access
          </Button>
          
          {pointsEnabled && (
            <Button 
              onClick={onUsePoints}
              variant="outline" 
              className="w-full border-white/30 text-white hover:bg-white/10 flex items-center justify-center gap-2"
              size="lg"
            >
              <Sparkles className="h-5 w-5" />
              Unlock with {pointsValue} Points
            </Button>
          )}
        </div>
      </motion.div>
      
      {freeAccessLeft > 0 && (
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.05 }}
        >
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 text-xs font-semibold">
            {freeAccessLeft} Free {freeAccessLeft === 1 ? 'Access' : 'Accesses'} Left
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PremiumContentOverlay;
