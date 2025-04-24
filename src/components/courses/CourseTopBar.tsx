
import React from 'react';
import { ChevronLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ContentItem } from '@/types/library';

interface CourseTopBarProps {
  course: ContentItem;
  progress: number;
  isFavorite: boolean;
  isDarkMode: boolean;
  onFavoriteToggle: () => void;
  onBack: () => void;
  onDarkModeToggle?: () => void;
}

const CourseTopBar: React.FC<CourseTopBarProps> = ({
  course,
  progress,
  isFavorite,
  isDarkMode,
  onFavoriteToggle,
  onBack
}) => {
  return (
    <div className={`sticky top-0 z-10 w-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-b shadow-sm`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <h1 className="text-xl font-bold truncate">{course.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-sm font-medium">
                {progress}% completed
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onFavoriteToggle}
              className="flex items-center"
            >
              {isFavorite ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile progress bar */}
        <div className="sm:hidden mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">{progress}% completed</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};

export default CourseTopBar;
