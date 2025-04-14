
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, BadgeCheck, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentProgressProps {
  progress: number;
  showProgress: boolean;
  pointsValue?: number;
  pointsEnabled?: boolean;
  isCompleted?: boolean;
  format?: string;
  badges?: { name: string; description: string; }[];
}

const ContentProgress: React.FC<ContentProgressProps> = ({ 
  progress, 
  showProgress, 
  pointsValue = 0,
  pointsEnabled = false,
  isCompleted = false,
  format,
  badges = []
}) => {
  if (!showProgress) return null;
  
  const getCompletionText = () => {
    if (format === 'pdf') return `${progress}% read`;
    if (format === 'video') return `${progress}% watched`;
    if (format === 'audio') return `${progress}% listened`;
    if (format === 'course') return `${progress}% completed`;
    return `${progress}% complete`;
  };

  return (
    <div className="mb-6 bg-card shadow-sm border rounded-md p-4">
      <div className="flex justify-between text-sm mb-3">
        <span className="text-muted-foreground flex items-center font-medium">
          <Trophy className="h-4 w-4 mr-1.5 text-amber-500" /> Progress
        </span>
        <span className="font-medium flex items-center">
          {progress < 100 
            ? getCompletionText()
            : (
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-primary flex items-center"
              >
                <BadgeCheck className="h-4 w-4 mr-1.5" /> Completed!
              </motion.span>
            )}
        </span>
      </div>
      <Progress value={progress} className="h-2.5 mb-3" />
      
      {/* XP information */}
      {pointsEnabled && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
            {isCompleted 
              ? `Earned ${pointsValue} XP` 
              : `Earn ${pointsValue} XP upon completion`}
          </span>
          
          {progress > 0 && progress < 100 && (
            <span>
              {format === 'pdf' && "Scroll 90% to complete"}
              {format === 'video' && "Watch to earn XP"}
              {format === 'audio' && "Listen 70% to complete"}
              {format === 'course' && "Complete all modules"}
            </span>
          )}
        </div>
      )}
      
      {/* Earned points animation */}
      {isCompleted && pointsEnabled && pointsValue > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-md text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">+{pointsValue} XP earned!</span>
          </div>
        </motion.div>
      )}
      
      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium mb-2">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>Badges</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="bg-muted/50 px-2 py-1 rounded-full text-xs flex items-center"
                title={badge.description}
              >
                <Award className="h-3 w-3 mr-1 text-amber-500" />
                {badge.name}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentProgress;
