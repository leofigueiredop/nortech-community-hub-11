
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { usePoints } from '@/context/PointsContext';
import PointsHistory from './PointsHistory';
import ContentProgress from './ContentProgress';
import { Award, Gift, ChevronRight, Trophy, BookOpen, Star } from 'lucide-react';

const PointsDashboard: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, nextLevel, progress } = getUserLevel();

  const badges = [
    { name: "Early Adopter", description: "Joined during beta", icon: <Star className="h-8 w-8 text-amber-500" /> },
    { name: "Course Master", description: "Completed 5 courses", icon: <BookOpen className="h-8 w-8 text-blue-500" /> },
    { name: "Community Pillar", description: "100+ helpful comments", icon: <Trophy className="h-8 w-8 text-purple-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Your Points & Level</CardTitle>
            <CardDescription>
              Earn points by participating in the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {level}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <h3 className="text-2xl font-bold">{totalPoints} Points</h3>
                </div>
              </div>
              <Link to="/points/store">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Gift className="mr-2 h-4 w-4" />
                  Visit Rewards Store
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Level {level}</span>
                <span>Level {nextLevel}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                {progress}% to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Badges</CardTitle>
            <CardDescription>Earned through achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                  {badge.icon}
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-between mt-2">
                View all badges
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content Progress</TabsTrigger>
          <TabsTrigger value="rewards">Popular Rewards</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <ContentProgress />
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center">
                  <Gift className="h-12 w-12 text-purple-500 dark:text-purple-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-1">Premium Reward #{item}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Special reward for active members</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-600 dark:text-purple-400">{item * 100} Points</span>
                    <Link to="/points/store">
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/points/store">
              <Button variant="outline" className="mt-2">
                Browse All Rewards
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <PointsHistory />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-4">
                <Award className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-1">Community Leaders</h3>
                <p className="text-sm text-muted-foreground mb-4">See who's on top of the points leaderboard</p>
                <Link to="/leaderboard">
                  <Button>
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointsDashboard;
