
import React from 'react';
import { Trophy, Medal, Award, Star, Download } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CourseAchievementsProps {
  course: ContentItem;
  progress: number;
  isDarkMode: boolean;
}

const CourseAchievements: React.FC<CourseAchievementsProps> = ({
  course,
  progress,
  isDarkMode
}) => {
  const canGetCertificate = progress >= 100;
  
  return (
    <div className={`space-y-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
      {/* Certification Section */}
      <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} shadow-md`}>
        <div className={`p-4 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Certificate</span>
          </h2>
        </div>
        
        <div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Course Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="text-center mt-6">
            {canGetCertificate ? (
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete the course to earn your certificate
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* XP and Badges Section */}
      <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} shadow-md`}>
        <div className={`p-4 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span>Achievements</span>
          </h2>
        </div>
        
        <div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">XP Earned</span>
              <span className="text-sm font-medium">{Math.round(progress * 10)}/1000</span>
            </div>
            <Progress value={progress / 10} className="h-2" />
          </div>
          
          {/* Badges */}
          <h3 className="font-medium text-sm mb-3">Badges</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <BadgeItem 
              icon={<Trophy className="h-6 w-6" />}
              name="Starter"
              isEarned={progress >= 10}
              isDarkMode={isDarkMode}
            />
            <BadgeItem 
              icon={<Medal className="h-6 w-6" />}
              name="Halfway"
              isEarned={progress >= 50}
              isDarkMode={isDarkMode}
            />
            <BadgeItem 
              icon={<Award className="h-6 w-6" />}
              name="Completer"
              isEarned={progress >= 100}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Write Paper */}
          <div className="border-t pt-4 mt-4 border-muted">
            <h3 className="font-medium text-sm mb-2">Additional Achievements</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">Write a Paper</div>
                <div className="text-xs text-muted-foreground">Earn extra XP</div>
              </div>
              <Button variant="outline" size="sm">Start</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BadgeItemProps {
  icon: React.ReactNode;
  name: string;
  isEarned: boolean;
  isDarkMode: boolean;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ icon, name, isEarned, isDarkMode }) => {
  return (
    <div 
      className={`flex flex-col items-center p-2 rounded-md ${
        isEarned 
          ? 'text-amber-500' 
          : `text-gray-400 opacity-50 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`
      }`}
    >
      <div 
        className={`w-12 h-12 flex items-center justify-center rounded-full mb-1 ${
          isEarned 
            ? 'bg-amber-500/20'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {icon}
      </div>
      <div className="text-xs font-medium truncate w-full text-center">
        {name}
      </div>
    </div>
  );
};

export default CourseAchievements;
