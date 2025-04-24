
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles } from 'lucide-react';

interface PremiumContentOverlayProps {
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessLeft?: number;
  onSubscribe?: () => void;
  onUsePoints?: () => void;
}

const PremiumContentOverlay: React.FC<PremiumContentOverlayProps> = ({
  pointsEnabled = false,
  pointsValue = 150,
  freeAccessLeft = 0,
  onSubscribe = () => {},
  onUsePoints = () => {},
}) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 max-w-md text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-3 shadow-lg"
          whileHover={{ scale: 1.05 }}
          animate={{ 
            boxShadow: ["0px 0px 0px rgba(251, 191, 36, 0)", "0px 0px 20px rgba(251, 191, 36, 0.5)", "0px 0px 0px rgba(251, 191, 36, 0)"],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Lock className="h-8 w-8 text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-1">Premium Content</h3>
        <p className="text-white/80 mb-2">Subscribe to unlock this premium content</p>
        
        <div className="space-y-3 w-full">
          <Button 
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center gap-2 shadow-lg"
            size="lg"
          >
            <Crown className="h-5 w-5" />
            Subscribe to Unlock
          </Button>
          
          {pointsEnabled && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 rounded-lg p-1"
            >
              <Button 
                onClick={onUsePoints}
                variant="outline" 
                className="w-full border-white/30 bg-white/5 text-white hover:bg-white/20 flex items-center justify-center gap-2 backdrop-blur-sm"
                size="lg"
              >
                <Sparkles className="h-5 w-5" />
                Use {pointsValue} Points
              </Button>
            </motion.div>
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
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 text-xs font-semibold shadow-md">
            {freeAccessLeft} Free {freeAccessLeft === 1 ? 'Access' : 'Accesses'} Left
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PremiumContentOverlay;
