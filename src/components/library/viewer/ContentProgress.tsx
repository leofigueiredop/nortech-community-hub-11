
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentProgressProps {
  progress: number;
  showProgress: boolean;
  pointsValue?: number;
  pointsEnabled?: boolean;
  isCompleted?: boolean;
}

const ContentProgress: React.FC<ContentProgressProps> = ({ 
  progress, 
  showProgress, 
  pointsValue = 0,
  pointsEnabled = false,
  isCompleted = false 
}) => {
  if (!showProgress) return null;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground flex items-center">
          <Trophy className="h-3 w-3 mr-1" /> Progress
        </span>
        <span className="font-medium flex items-center">
          {progress < 100 
            ? `${progress}% complete` 
            : (
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-primary flex items-center"
              >
                <BadgeCheck className="h-4 w-4 mr-1" /> Completed!
              </motion.span>
            )}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      {isCompleted && pointsEnabled && pointsValue > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-md text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">You earned {pointsValue} points!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContentProgress;
