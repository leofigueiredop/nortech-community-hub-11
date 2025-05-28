import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Star, CircleCheck, CircleX, Lock } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import ContentProgressList from './ContentProgressList';

const PointsOverview: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level } = getUserLevel();
  
  // Mock data for UI demonstration
  const streak = 3;
  const weeklyMissions = [
    { id: 'wm1', title: 'Complete 2 courses', progress: 50, points: 25, completed: false },
    { id: 'wm2', title: 'Leave 5 comments', progress: 80, points: 15, completed: false },
    { id: 'wm3', title: 'Daily login streak', progress: 60, points: 10, completed: false },
    { id: 'wm4', title: 'Share content', progress: 100, points: 5, completed: true },
  ];
  
  const achievements = [
    { id: 'a1', title: 'First Steps', description: 'Complete your first course', unlocked: true },
    { id: 'a2', title: 'Friendly Face', description: 'Make 10 comments', unlocked: true },
    { id: 'a3', title: 'Content Creator', description: 'Create your first post', unlocked: false },
    { id: 'a4', title: '???', description: 'Hidden achievement', unlocked: false },
  ];
  
  // Mock content progress items for demonstration
  const contentProgress = [
    {
      id: 'p1',
      user_id: 'user-1',
      content_id: 'c1',
      progress_percent: 100,
      completed_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      points_awarded: true,
      contentId: 'c1',
      progress: 100,
      completed: true,
      lastAccessedAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      user_id: 'user-1',
      content_id: 'c2',
      progress_percent: 45,
      completed_at: null,
      last_accessed_at: new Date(Date.now() - 86400000).toISOString(),
      points_awarded: false,
      contentId: 'c2',
      progress: 45,
      completed: false,
      lastAccessedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'p3',
      user_id: 'user-1',
      content_id: 'c3',
      progress_percent: 75,
      completed_at: null,
      last_accessed_at: new Date(Date.now() - 172800000).toISOString(),
      points_awarded: false,
      contentId: 'c3',
      progress: 75,
      completed: false,
      lastAccessedAt: new Date(Date.now() - 172800000).toISOString(),
    }
  ];

  // Function to get content title by ID
  const getContentTitle = (id: string): string => {
    const titles: Record<string, string> = {
      'c1': 'Getting Started with Our Platform',
      'c2': 'Advanced User Management Techniques',
      'c3': 'Building Your First Integration',
    };
    return titles[id] || 'Unknown Content';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Weekly Missions Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Weekly Missions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyMissions.map(mission => (
                <div key={mission.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {mission.completed ? (
                        <CircleCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }} 
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CircleX className="h-5 w-5 text-orange-400" />
                        </motion.div>
                      )}
                      <span className={`font-medium ${mission.completed ? 'text-green-500' : ''}`}>
                        {mission.title}
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={`${mission.completed ? 'bg-green-500' : 'bg-purple-500'}`}>
                            +{mission.points} pts
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {mission.completed 
                            ? 'Mission completed! Points awarded.' 
                            : `Complete this mission to earn ${mission.points} points!`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Progress value={mission.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground mt-1 absolute right-0 -top-5">
                      {mission.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Learning Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-green-500" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContentProgressList 
              progressItems={contentProgress}
              getContentTitle={getContentTitle}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        {/* User Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Daily Streak</p>
                  <motion.p 
                    className="text-xl font-bold text-purple-800 dark:text-purple-200"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {streak} days
                  </motion.p>
                </div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300">Next Reward</p>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200">25 pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-md border flex items-center gap-3 
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/50' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}
              >
                <div className={`p-2 rounded-full 
                  ${achievement.unlocked 
                    ? 'bg-amber-200 dark:bg-amber-900' 
                    : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {achievement.unlocked ? (
                    <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PointsOverview; 