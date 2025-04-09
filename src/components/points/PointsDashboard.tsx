
import React from 'react';
import { usePoints, POINTS_VALUES } from '@/context/PointsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PointsHistory from './PointsHistory';
import { Trophy, Calendar, Heart, MessageSquare, Bookmark, Users, Award } from 'lucide-react';

const PointsDashboard: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, nextLevel, progress } = getUserLevel();

  return (
    <div className="space-y-6">
      <Card className="border-nortech-purple/30">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Points & Rewards</CardTitle>
              <CardDescription>Track your activity and earned points</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-nortech-purple" />
              <span className="text-2xl font-bold text-nortech-purple">{totalPoints}</span>
              <span className="text-sm text-muted-foreground">points</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-nortech-purple" />
                <span className="font-medium">Level {level}</span>
              </div>
              <span className="text-sm text-muted-foreground">Level {nextLevel}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-right">{progress}% to next level</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm">Daily Login</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.login} pts</p>
                <p className="text-xs text-muted-foreground">per day</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <CardTitle className="text-sm">Comment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.comment} pts</p>
                <p className="text-xs text-muted-foreground">per comment</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <CardTitle className="text-sm">Like</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.like} pts</p>
                <p className="text-xs text-muted-foreground">per like</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-violet-500" />
                  <CardTitle className="text-sm">Course</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.course_completion} pts</p>
                <p className="text-xs text-muted-foreground">per completion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-sm">Event</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.event_participation} pts</p>
                <p className="text-xs text-muted-foreground">per event</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-500" />
                  <CardTitle className="text-sm">Referral</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold">{POINTS_VALUES.referral} pts</p>
                <p className="text-xs text-muted-foreground">per referral</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <PointsHistory />
    </div>
  );
};

export default PointsDashboard;
