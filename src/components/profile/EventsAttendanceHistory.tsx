
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

// Mock attendance history - in a real app this would come from an API
const MOCK_ATTENDANCE_HISTORY = [
  {
    id: 1,
    eventName: 'Web Development Summit',
    eventType: 'conference',
    date: new Date(2025, 3, 5),
    location: 'Online',
    pointsEarned: 50,
    badges: ['Web Summit Attendee', 'Early Bird']
  },
  {
    id: 2,
    eventName: 'React Hooks Workshop',
    eventType: 'workshop',
    date: new Date(2025, 2, 20),
    location: 'Tech Hub São Paulo',
    pointsEarned: 30,
    badges: ['Workshop Participant']
  },
  {
    id: 3,
    eventName: 'AI in Business Conference',
    eventType: 'conference',
    date: new Date(2025, 1, 15),
    location: 'Business Center Rio',
    pointsEarned: 40,
    badges: ['AI Conference Attendee']
  },
  {
    id: 4,
    eventName: 'Networking Breakfast',
    eventType: 'networking',
    date: new Date(2025, 0, 25),
    location: 'Café Tech Belo Horizonte',
    pointsEarned: 20,
    badges: ['Networker']
  },
  {
    id: 5,
    eventName: 'Tech Career Fair',
    eventType: 'career',
    date: new Date(2024, 11, 10),
    location: 'University Campus',
    pointsEarned: 25,
    badges: ['Career Explorer']
  }
];

// Event type badge colors
const EVENT_TYPE_COLORS = {
  conference: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  workshop: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  webinar: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  networking: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  career: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  hackathon: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

interface EventsAttendanceHistoryProps {
  userId?: string;
}

const EventsAttendanceHistory: React.FC<EventsAttendanceHistoryProps> = ({ userId }) => {
  // In a real app, this would fetch data based on userId
  const attendanceHistory = MOCK_ATTENDANCE_HISTORY;
  
  // Calculate stats
  const totalEvents = attendanceHistory.length;
  const totalPoints = attendanceHistory.reduce((sum, event) => sum + event.pointsEarned, 0);
  const allBadges = attendanceHistory.flatMap(event => event.badges);
  const uniqueBadges = [...new Set(allBadges)].length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Attendance History</CardTitle>
        <CardDescription>Your participation in community events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center p-4 border rounded-lg">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Events Attended</p>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-lg">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Points Earned</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-lg">
            <Badge className="h-8 w-8 text-amber-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-2xl font-bold">{uniqueBadges}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceHistory.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event.eventName}</div>
                    <Badge 
                      variant="secondary" 
                      className={EVENT_TYPE_COLORS[event.eventType as keyof typeof EVENT_TYPE_COLORS] || EVENT_TYPE_COLORS.default}
                    >
                      {event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-muted-foreground" />
                      {format(event.date, 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-muted-foreground" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      +{event.pointsEarned}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {event.badges.map((badge, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsAttendanceHistory;
