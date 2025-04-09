
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// Mock data for activity log
const mockActivityLog = [
  { 
    id: 1, 
    userId: 1, 
    userName: 'João Silva', 
    activityType: 'login', 
    pointsEarned: 5, 
    description: 'Daily login bonus', 
    timestamp: new Date(2025, 3, 9, 9, 30) 
  },
  { 
    id: 2, 
    userId: 2, 
    userName: 'Maria Souza', 
    activityType: 'comment', 
    pointsEarned: 3, 
    description: 'Comment on "AI Development Best Practices"', 
    timestamp: new Date(2025, 3, 9, 10, 15) 
  },
  { 
    id: 3, 
    userId: 3, 
    userName: 'Carlos Ferreira', 
    activityType: 'course_completion', 
    pointsEarned: 50, 
    description: 'Completed "Web Development Fundamentals"', 
    timestamp: new Date(2025, 3, 9, 11, 5) 
  },
  { 
    id: 4, 
    userId: 1, 
    userName: 'João Silva', 
    activityType: 'like', 
    pointsEarned: 1, 
    description: 'Liked "Community Guidelines"', 
    timestamp: new Date(2025, 3, 9, 11, 45) 
  },
  { 
    id: 5, 
    userId: 4, 
    userName: 'Ana Oliveira', 
    activityType: 'event_participation', 
    pointsEarned: 20, 
    description: 'Participated in "Tech Meetup April 2025"', 
    timestamp: new Date(2025, 3, 8, 14, 30) 
  },
  { 
    id: 6, 
    userId: 5, 
    userName: 'Pedro Santos', 
    activityType: 'referral', 
    pointsEarned: 25, 
    description: 'Referred new user Clara Lima', 
    timestamp: new Date(2025, 3, 8, 16, 20) 
  },
  { 
    id: 7, 
    userId: 2, 
    userName: 'Maria Souza', 
    activityType: 'course_completion', 
    pointsEarned: 50, 
    description: 'Completed "Advanced React Patterns"', 
    timestamp: new Date(2025, 3, 8, 18, 10) 
  },
];

const activityTypeColors = {
  login: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  comment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  like: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  course_completion: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  event_participation: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  referral: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

const activityLabels = {
  login: 'Login',
  comment: 'Comment',
  like: 'Like',
  course_completion: 'Course',
  event_participation: 'Event',
  referral: 'Referral',
};

const PointsActivityLog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  
  const filteredActivities = mockActivityLog.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesActivity = 
      activityFilter === 'all' || activity.activityType === activityFilter;
      
    return matchesSearch && matchesActivity;
  });
  
  const exportToCSV = () => {
    // Implementation would export the activity log to CSV
    console.log('Exporting activity log to CSV');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Track all point-earning activities in your community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={activityFilter}
                onValueChange={setActivityFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="like">Likes</SelectItem>
                  <SelectItem value="course_completion">Course Completion</SelectItem>
                  <SelectItem value="event_participation">Event Participation</SelectItem>
                  <SelectItem value="referral">Referrals</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={exportToCSV}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.userName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={activityTypeColors[activity.activityType as keyof typeof activityTypeColors]}>
                          {activityLabels[activity.activityType as keyof typeof activityLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>+{activity.pointsEarned}</TableCell>
                      <TableCell>
                        {format(activity.timestamp, "PPp", { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsActivityLog;
