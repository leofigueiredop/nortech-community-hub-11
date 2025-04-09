
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Import the same events data and type definitions from the Events page
// This would ideally come from a shared data source or context
const EVENTS = [
  // Same as in Events.tsx
  {
    id: 1,
    title: "React Workshop: Building Modern UIs",
    description: "Learn how to build beautiful UIs with React and modern design principles",
    date: new Date(2025, 3, 8), // April 8, 2025
    time: "10:00 AM - 12:00 PM",
    type: "workshop",
    location: "Online",
    speaker: "Alex Johnson",
    attendees: 24,
    capacity: 30,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Community Q&A Session",
    description: "Open discussion and Q&A with the community members",
    date: new Date(2025, 3, 10), // April 10, 2025
    time: "6:00 PM - 7:30 PM",
    type: "meetup",
    location: "Online",
    speaker: "Emma Wilson",
    attendees: 15,
    capacity: 50,
    image: null
  },
  {
    id: 3,
    title: "State Management Deep Dive",
    description: "Exploring different state management solutions and when to use them",
    date: new Date(2025, 3, 15), // April 15, 2025
    time: "2:00 PM - 4:00 PM",
    type: "webinar",
    location: "Online",
    speaker: "Marcus Chen",
    attendees: 42,
    capacity: 100,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "1:1 Mentoring Session",
    description: "Personal career guidance and code review with a senior developer",
    date: new Date(2025, 3, 20), // April 20, 2025
    time: "3:00 PM - 4:00 PM",
    type: "mentoria",
    location: "Online",
    speaker: "Sophia Garcia",
    attendees: 1,
    capacity: 1,
    image: null
  },
  {
    id: 5,
    title: "Live Coding: Building a Full-Stack App",
    description: "Watch as we build a complete application from scratch with React and Node.js",
    date: new Date(2025, 3, 22), // April 22, 2025
    time: "1:00 PM - 3:00 PM",
    type: "live",
    location: "YouTube Live",
    speaker: "David Kim",
    attendees: 135,
    capacity: 500,
    image: "https://images.unsplash.com/photo-1610986603166-f78428624e76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const EVENT_TYPES = {
  workshop: { 
    label: "Workshop", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  },
  meetup: { 
    label: "Meetup", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  },
  webinar: { 
    label: "Webinar", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  },
  live: { 
    label: "Live Session", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  },
  mentoria: { 
    label: "Mentoring", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
  }
};

const EventsWeekly = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState(EVENTS);
  const { toast } = useToast();

  // Get the days of the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Handle navigation between weeks
  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };

  // RSVP handler
  const handleRSVP = (eventId) => {
    toast({
      title: "RSVP Confirmed",
      description: `You've successfully registered for this event!`,
    });
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  return (
    <MainLayout title="Weekly Events">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekly Calendar</h1>
          <div className="flex items-center gap-3">
            <div className="border rounded-lg flex overflow-hidden">
              <Link to="/events">
                <Button variant="ghost" size="sm" className="rounded-none">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>Monthly</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="rounded-none bg-muted">
                <Clock size={16} className="mr-2" />
                <span>Weekly</span>
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-7 gap-4">
              {/* Day headers */}
              {daysOfWeek.map((day, index) => (
                <div 
                  key={index} 
                  className={`text-center p-2 font-medium ${
                    isSameDay(day, new Date()) ? 'bg-purple-100 dark:bg-purple-900/30 rounded-md' : ''
                  }`}
                >
                  <div className="mb-1">{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
              
              {/* Week grid */}
              {daysOfWeek.map((day, index) => {
                const dayEvents = events.filter(event => 
                  isSameDay(new Date(event.date), day)
                );
                
                return (
                  <div key={`events-${index}`} className="min-h-[200px] border rounded-md p-2">
                    {dayEvents.length > 0 ? (
                      <div>
                        {dayEvents.map(event => {
                          const eventType = EVENT_TYPES[event.type];
                          return (
                            <div 
                              key={event.id} 
                              className="mb-2 p-2 rounded-md border bg-card hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div className="font-medium text-sm">{event.title}</div>
                                <Badge className={eventType.color}>
                                  {eventType.label}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">{event.time}</div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs mt-1 h-6"
                                onClick={() => handleRSVP(event.id)}
                              >
                                RSVP
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        No events
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EventsWeekly;
