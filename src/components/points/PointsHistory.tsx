
import React from 'react';
import { usePoints, PointsActivity } from '@/context/PointsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getActivityIcon = (type: PointsActivity['type']) => {
  switch (type) {
    case 'login':
      return <Calendar className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4" />;
    case 'course_completion':
      return <Bookmark className="h-4 w-4" />;
    case 'event_participation':
      return <Calendar className="h-4 w-4" />;
    case 'referral':
      return <Share2 className="h-4 w-4" />;
    default:
      return <Trophy className="h-4 w-4" />;
  }
};

const PointsHistoryItem: React.FC<{ activity: PointsActivity }> = ({ activity }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {getActivityIcon(activity.type)}
        </div>
        <div>
          <p className="text-sm font-medium">{activity.description}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <span className="text-sm font-semibold">+{activity.points}</span>
        <span className="text-xs">pts</span>
      </div>
    </div>
  );
};

const PointsHistory: React.FC = () => {
  const { pointsHistory } = usePoints();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Points History</CardTitle>
        <CardDescription>Your recent points activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {pointsHistory.length > 0 ? (
            pointsHistory.slice(0, 5).map(activity => (
              <PointsHistoryItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No points activity yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsHistory;
