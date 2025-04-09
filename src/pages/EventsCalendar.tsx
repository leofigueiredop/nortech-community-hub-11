
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Presentation,
  BookOpen,
  ChevronsRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Import the same events data and type definitions
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

const EventsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState(EVENTS);
  const { toast } = useToast();
  
  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Week days header
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Handle navigation between months
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
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

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  // Selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <MainLayout title="Events Calendar">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events Calendar</h1>
          <div className="flex items-center gap-3">
            <div className="border rounded-lg flex overflow-hidden">
              <Link to="/events">
                <Button variant="ghost" size="sm" className="rounded-none">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>Main</span>
                </Button>
              </Link>
              <Link to="/events/weekly">
                <Button variant="ghost" size="sm" className="rounded-none">
                  <Clock size={16} className="mr-2" />
                  <span>Weekly</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="rounded-none bg-muted">
                <CalendarIcon size={16} className="mr-2" />
                <span>Calendar</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Day names */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center font-medium text-sm text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div 
                        key={index}
                        className={`
                          min-h-24 p-1 border rounded-md relative
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50 dark:bg-gray-900/30' : ''}
                          ${isSelected ? 'ring-2 ring-nortech-purple' : ''}
                          ${isToday ? 'bg-purple-50 dark:bg-purple-900/10' : ''}
                          hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-right mb-1 pr-1">
                          <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                            {format(day, 'd')}
                          </span>
                        </div>
                        
                        {dayEvents.length > 0 && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => {
                              const eventType = EVENT_TYPES[event.type];
                              return (
                                <div 
                                  key={event.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate ${eventType.color}`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-center text-gray-500">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium">
                  {selectedDate 
                    ? format(selectedDate, 'MMMM d, yyyy') 
                    : 'Select a date to see events'}
                </h2>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {selectedDateEvents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDateEvents.map(event => {
                          const eventType = EVENT_TYPES[event.type];
                          return (
                            <div 
                              key={event.id}
                              className="p-3 border rounded-lg bg-card"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{event.title}</h3>
                                <Badge className={`flex items-center ${eventType.color}`}>
                                  {eventType.icon}
                                  {eventType.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {event.description}
                              </p>
                              <div className="text-sm mb-1">
                                <span className="text-gray-500 mr-2">Time:</span>
                                {event.time}
                              </div>
                              <div className="text-sm mb-1">
                                <span className="text-gray-500 mr-2">Speaker:</span>
                                {event.speaker}
                              </div>
                              <div className="text-sm mb-3">
                                <span className="text-gray-500 mr-2">Attendees:</span>
                                {event.attendees}/{event.capacity}
                              </div>
                              <Button 
                                onClick={() => handleRSVP(event.id)}
                                className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
                                disabled={event.attendees >= event.capacity}
                              >
                                {event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <p>No events scheduled for this date.</p>
                      </div>
                    )}
                  </ScrollArea>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <p>Select a date to view events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventsCalendar;
