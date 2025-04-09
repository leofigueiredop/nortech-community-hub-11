
// Since ProfileForm is a read-only file, let's create an extension component to add points info to user profiles

import React from 'react';
import { usePoints } from '@/context/PointsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const ProfilePointsInfo: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, nextLevel, progress } = getUserLevel();

  return (
    <Card className="mb-4 border-nortech-purple/30">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-nortech-purple" />
            <span className="font-medium">Level {level}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-nortech-purple">{totalPoints}</span>
            <span className="text-xs ml-1 text-muted-foreground">points</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
        <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% to Level {nextLevel}</p>
      </CardContent>
    </Card>
  );
};
