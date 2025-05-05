import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PointsBadge from '@/components/points/PointsBadge';
import PointsHistory from '@/components/points/PointsHistory';
import ContentProgressList from '@/components/points/ContentProgressList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Flame, Clock, Trophy, Zap, Gift } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';
import { Link } from 'react-router-dom';

const PointsDashboard: React.FC = () => {
  const { 
    totalPoints, 
    getUserLevel, 
    pointsHistory
  } = usePoints();
  
  const { level, nextLevel, progress } = getUserLevel();
  
  // Mock content progress items
  const contentProgress = [
    {
      id: 'p1',
      contentId: 'c1',
      progress: 100,
      completed: true,
      lastAccessedAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      contentId: 'c2',
      progress: 45,
      completed: false,
      lastAccessedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 'p3',
      contentId: 'c3',
      progress: 75,
      completed: false,
      lastAccessedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
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
    <MainLayout title="Points & Progress">
      <div className="container py-6 max-w-7xl">
        {/* Points banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex-shrink-0">
              <div className="bg-white/20 p-4 rounded-full">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">You've earned {totalPoints} Points!</h1>
              <p className="text-white/80 mb-4">Level {level} • {progress} points to reach Level {nextLevel}</p>
              
              <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                <div 
                  className="bg-white h-full rounded-full" 
                  style={{ width: `${Math.min(((totalPoints % 1000) / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Link to="/points/store">
                <Button variant="secondary" className="gap-2">
                  <Gift className="h-4 w-4" /> Rewards Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">3 Days</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Content Completed</p>
                <p className="text-2xl font-bold">{contentProgress.filter(item => item.completed).length}/{contentProgress.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points Spent</p>
                <p className="text-2xl font-bold">250</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="w-full max-w-md mb-4">
            <TabsTrigger value="progress" className="flex-1">Content Progress</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Points History</TabsTrigger>
            <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Content Progress</CardTitle>
                <CardDescription>
                  Track your progress across all content formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentProgressList 
                  progressItems={contentProgress}
                  getContentTitle={getContentTitle}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>
                  Recent points earned and spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PointsHistory />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>
                  Achievements you've unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center p-4 border rounded-lg bg-muted/40">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full mb-2">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium text-center">Badge {i + 1}</p>
                      <p className="text-xs text-muted-foreground text-center">Earned on {new Date().toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PointsDashboard;
