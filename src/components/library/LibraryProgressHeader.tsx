import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LibraryProgressHeaderProps {
  totalItems?: number;
  completedItems?: number;
  totalXP?: number;
  weeklyCompleted?: number;
  showWeeklyChallenge?: boolean;
  onDismissChallenge?: () => void;
}

const LibraryProgressHeader: React.FC<LibraryProgressHeaderProps> = ({
  totalItems = 25,
  completedItems = 8,
  totalXP = 1250,
  weeklyCompleted = 1,
  showWeeklyChallenge = true,
  onDismissChallenge = () => {},
}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-semibold">Library Progress</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">{completedItems}</span>
              <span className="text-gray-400 dark:text-gray-500">/{totalItems} items completed</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Total XP: {totalXP.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {showWeeklyChallenge && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <span className="font-medium text-purple-900 dark:text-purple-100">Weekly Challenge: </span>
                <span className="text-purple-700 dark:text-purple-300">Complete 3 Videos this Week</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium text-purple-900 dark:text-purple-100">{weeklyCompleted}</span>
                <span className="text-purple-600 dark:text-purple-300">/3 completed</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDismissChallenge}
                className="h-7 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryProgressHeader; 