
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PointsBadge from '@/components/points/PointsBadge';
import PointsHistory from '@/components/points/PointsHistory';
import ContentProgressList from '@/components/points/ContentProgressList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { usePointsContext } from '@/context/PointsContext';
import { Link } from 'react-router-dom';

const PointsDashboard: React.FC = () => {
  const { 
    userPoints, 
    userLevel, 
    pointsToNextLevel,
    pointsHistory,
    contentProgress 
  } = usePointsContext();

  return (
    <MainLayout title="Points & Progress">
      <div className="container py-6 space-y-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Points Summary Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Points & Progress</CardTitle>
              <CardDescription>
                Track your activity and earn points to unlock premium content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <PointsBadge 
                  points={userPoints} 
                  level={userLevel} 
                  size="lg" 
                />
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{userPoints} Points</h3>
                  <p className="text-muted-foreground">
                    Level {userLevel} • {pointsToNextLevel} points to next level
                  </p>
                  <div className="h-2 bg-secondary rounded-full w-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ 
                        width: `${Math.min(
                          ((userPoints % 1000) / 1000) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <Link to="/points/store">
                  <Button className="gap-2">
                    Rewards Store <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
              <CardDescription>
                Progress and engagement statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-2xl font-bold">{userPoints}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Items Completed</p>
                  <p className="text-2xl font-bold">
                    {contentProgress.filter(item => item.completed).length}
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">3 days</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Points Used</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="w-full max-w-md mb-4">
            <TabsTrigger value="progress" className="flex-1">Content Progress</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Points History</TabsTrigger>
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
                <PointsHistory 
                  history={pointsHistory}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PointsDashboard;
