
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePoints } from '@/context/PointsContext';
import PointsHistory from '@/components/points/PointsHistory';
import ContentProgressList from '@/components/points/ContentProgressList';
import { useContentProgress } from '@/hooks/useContentProgress';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Trophy, Clock, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentProgress } from '@/types/library';

const mockContentProgress: ContentProgress[] = [
  {
    id: 'progress1',
    userId: 'user1',
    contentId: 'content1',
    progress: 100,
    completed: true,
    lastAccessedAt: new Date().toISOString(),
    pointsAwarded: true
  },
  {
    id: 'progress2',
    userId: 'user1',
    contentId: 'content2',
    progress: 50,
    completed: false,
    lastAccessedAt: new Date().toISOString(),
    pointsAwarded: false
  }
];

const PointsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { totalPoints, pointsHistory, awardPoints } = usePoints();
  const contentProgressData = mockContentProgress;
  const { content } = useLibraryContent();

  const completedItems = contentProgressData.filter(item => item.completed).length;
  const pointsThisWeek = pointsHistory
    .filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return entryDate >= oneWeekAgo;
    })
    .reduce((sum, entry) => sum + entry.points, 0);

  const handleDemoPoints = () => {
    awardPoints({
      type: 'demo',
      description: 'Demonstration points',
      points: 50
    });
    toast({
      title: 'Points Awarded!',
      description: 'You received 50 points for testing',
    });
  };

  const getContentTitle = (contentId: string) => {
    const contentItem = content.find(item => item.id === contentId);
    return contentItem ? contentItem.title : 'Unknown Content';
  };

  const progressItems = contentProgressData.map(item => ({
    id: item.id,
    contentId: item.contentId,
    progress: item.progress,
    completed: item.completed,
    lastAccessedAt: item.lastAccessedAt
  }));

  return (
    <MainLayout title="Points Dashboard">
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Points Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link to="/points/store">
              <Button>
                Points Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDemoPoints}>
              Get Test Points
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available Points</CardDescription>
              <CardTitle className="flex items-center text-3xl">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                {totalPoints}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Points available to spend in the store</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Points Earned This Week</CardDescription>
              <CardTitle className="flex items-center text-3xl">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                {pointsThisWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Points earned in the last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Content Completed</CardDescription>
              <CardTitle className="flex items-center text-3xl">
                <BadgeCheck className="mr-2 h-5 w-5 text-green-500" />
                {completedItems}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total content items you've completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Points History</TabsTrigger>
            <TabsTrigger value="progress">Content Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {pointsHistory.length > 0 ? (
                    <div className="space-y-4">
                      {pointsHistory.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{entry.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-semibold text-green-600">+{entry.points}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activity yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How to Earn Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Complete Content</p>
                        <p className="text-sm text-muted-foreground">
                          Earn points by reading articles, watching videos, or completing courses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Participate in Events</p>
                        <p className="text-sm text-muted-foreground">
                          Join virtual events and workshops to earn participation points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Engage with Community</p>
                        <p className="text-sm text-muted-foreground">
                          Post comments, like content, and engage with other members
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>
                  A detailed history of all your points transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PointsHistory />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Content Progress</CardTitle>
                <CardDescription>
                  Track your progress through all content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentProgressList 
                  progressItems={progressItems} 
                  getContentTitle={getContentTitle} 
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
