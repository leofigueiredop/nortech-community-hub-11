import React from 'react';
import { usePoints } from '@/context/PointsContext';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PointsBadgeProps {
  variant?: 'compact' | 'full' | 'header';
  showLevel?: boolean;
  animated?: boolean;
}

const PointsBadge: React.FC<PointsBadgeProps> = ({ 
  variant = 'compact', 
  showLevel = true, 
  animated = true 
}) => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, progress } = getUserLevel();

  const getLevelIcon = (level: number) => {
    if (level >= 20) return <Crown className="h-4 w-4 text-purple-500" />;
    if (level >= 10) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (level >= 5) return <Star className="h-4 w-4 text-blue-500" />;
    return <Zap className="h-4 w-4 text-green-500" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'from-purple-500 to-pink-500';
    if (level >= 10) return 'from-yellow-500 to-orange-500';
    if (level >= 5) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  if (variant === 'header') {
    return (
      <Link to="/points" className="group">
        <motion.div
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getLevelColor(level)} flex items-center justify-center shadow-sm`}>
            {getLevelIcon(level)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {totalPoints.toLocaleString()}
            </span>
            {showLevel && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Level {level}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'full') {
    return (
      <Link to="/points" className="group">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          animate={animated ? { 
            boxShadow: ["0 4px 6px -1px rgba(0, 0, 0, 0.1)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getLevelIcon(level)}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Level {level}
              </span>
            </div>
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              animate={animated ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {totalPoints.toLocaleString()}
            </motion.div>
          </div>
          
          {showLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Progress to Level {level + 1}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(level)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    );
  }

  // Compact variant (default)
  return (
    <Link to="/points" className="group">
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getLevelIcon(level)}
        <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
          {totalPoints.toLocaleString()}
        </span>
        {showLevel && (
          <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded-full">
            L{level}
          </span>
        )}
      </motion.div>
    </Link>
  );
};

export default PointsBadge;
