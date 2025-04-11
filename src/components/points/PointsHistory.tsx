
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { usePoints } from '@/context/PointsContext';

const PointsHistory: React.FC = () => {
  const { pointsHistory } = usePoints();

  // Format date for display
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get badge color based on transaction type
  const getBadgeVariant = (points: number): "default" | "secondary" | "destructive" | "outline" => {
    if (points > 0) return "default";
    if (points < 0) return "destructive";
    return "secondary";
  };

  // Get badge text based on transaction type
  const getBadgeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      'content_view': 'Content View',
      'content_completion': 'Completion',
      'login_bonus': 'Login',
      'profile_update': 'Profile',
      'challenge_completion': 'Challenge',
      'quiz_completion': 'Quiz',
      'reward_redemption': 'Redemption'
    };
    
    return typeMap[type] || type;
  };

  if (pointsHistory.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No points activity yet.</p>
        <p className="mt-2">Complete activities to earn points!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Your points history</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pointsHistory.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell className="text-xs md:text-sm font-medium">
              {formatDate(activity.timestamp)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-muted">
                {getBadgeText(activity.type)}
              </Badge>
            </TableCell>
            <TableCell className="text-xs md:text-sm max-w-[200px] truncate">
              {activity.description}
            </TableCell>
            <TableCell className={`text-right font-medium ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {activity.points > 0 ? `+${activity.points}` : activity.points}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PointsHistory;
