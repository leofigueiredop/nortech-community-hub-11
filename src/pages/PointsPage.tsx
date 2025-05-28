import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Gift, Calendar, Star, ShoppingBag } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PointsHistory from '@/components/points/PointsHistory';
import PointsOverview from '@/components/points/PointsOverview';
import PointsStore from '@/components/points/store/PointsStore';
import PointsChallenges from '@/components/points/PointsChallenges';
import { motion } from 'framer-motion';

const PointsPage: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, nextLevel, progress } = getUserLevel();
  const { toast } = useToast();

  const handleLevelUp = () => {
    toast({
      title: "🎉 Level Up!",
      description: `Congratulations! You've reached Level ${level}!`,
    });
  };

  return (
    <MainLayout title="Points & Rewards">
      <div className="container py-6 max-w-7xl">
        {/* User Header with Avatar and Level */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-purple-200 shadow-md">
                <AvatarImage src="https://avatars.githubusercontent.com/u/1234567?v=4" alt="User Avatar" />
                <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-bold">
                  UN
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">User Name</h2>
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Trophy className="h-4 w-4" />
                  <span>Level {level} Explorer</span>
                </div>
              </div>
            </div>

            <div className="flex-1 mx-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Level {level}</span>
                <span className="font-medium">Level {nextLevel}</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-purple-100" />
                <motion.span 
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {progress}%
                </motion.span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{totalPoints} points total</span>
                <span>{Math.ceil((100 - progress) * totalPoints / 100)} points to next level</span>
              </div>
            </div>

            <Link to="/points/store" className="shrink-0">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Rewards Store
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white rounded">
              <span className="flex flex-col items-center gap-1 text-xs sm:text-sm">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="history" className="py-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white rounded">
              <span className="flex flex-col items-center gap-1 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="py-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white rounded">
              <span className="flex flex-col items-center gap-1 text-xs sm:text-sm">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="store" className="py-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white rounded">
              <span className="flex flex-col items-center gap-1 text-xs sm:text-sm">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Store</span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
            <PointsOverview />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
            <PointsHistory />
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
            <PointsChallenges />
          </TabsContent>
          
          <TabsContent value="store" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Available Rewards</h2>
              <Link to="/points/store">
                <Button variant="outline" className="gap-2 border-purple-300 hover:bg-purple-50">
                  <Gift className="h-4 w-4 text-purple-600" />
                  Full Rewards Store
                </Button>
              </Link>
            </div>
            <PointsStore />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PointsPage; 