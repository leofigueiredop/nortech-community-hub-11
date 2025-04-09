
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ChevronRight, Calendar, Users, Video, BookOpen, Presentation } from 'lucide-react';

// Event type definitions and colors
const EVENT_TYPES = {
  workshop: { 
    label: "Workshop", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: <BookOpen size={14} className="mr-1" />
  },
  meetup: { 
    label: "Meetup", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <Users size={14} className="mr-1" />
  },
  webinar: { 
    label: "Webinar", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: <Presentation size={14} className="mr-1" />
  },
  live: { 
    label: "Live Session", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <Video size={14} className="mr-1" />
  },
  mentoria: { 
    label: "Mentoring", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    icon: <Users size={14} className="mr-1" />
  }
};

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: keyof typeof EVENT_TYPES;
  location: string;
  speaker: string;
  attendees: number;
  capacity: number;
  image: string | null;
}

interface HomeFeedCalendarProps {
  events: Event[];
  maxEvents?: number;
}

const HomeFeedCalendar: React.FC<HomeFeedCalendarProps> = ({ 
  events,
  maxEvents = 3 
}) => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  // Filter upcoming events for next 7 days
  const upcomingEvents = events
    .filter(event => isAfter(new Date(event.date), today) && isBefore(new Date(event.date), nextWeek))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, maxEvents);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <Link to="/events">
            <Button variant="ghost" size="sm" className="text-nortech-purple">
              View all
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map(event => {
              const eventType = EVENT_TYPES[event.type];
              return (
                <div key={event.id} className="flex items-start p-2 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                      <span className="text-xs font-medium">{format(new Date(event.date), 'MMM')}</span>
                      <span className="text-lg font-bold">{format(new Date(event.date), 'd')}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <Badge className={`ml-2 flex items-center ${eventType.color}`}>
                        {eventType.icon}
                        {eventType.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.time} • {event.speaker}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No upcoming events in the next 7 days</p>
            <Link to="/events">
              <Button variant="link" className="mt-2 text-nortech-purple">
                View all events
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeFeedCalendar;
