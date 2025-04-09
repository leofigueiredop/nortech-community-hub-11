
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  View, 
  Grid, 
  List,
  Video,
  Users,
  Presentation,
  Megaphone,
  BookOpen,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addMonths, subMonths } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

// Mock event data with more variety
const EVENTS = [
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

// Event type definitions
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

const EventCard = ({ event, onRSVP }) => {
  const eventType = EVENT_TYPES[event.type];
  const { toast } = useToast();
  
  const handleRSVP = () => {
    toast({
      title: "RSVP Confirmed",
      description: `You've successfully registered for "${event.title}"`,
    });
    onRSVP(event.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="text-sm">
              {format(event.date, 'MMMM d, yyyy')} • {event.time}
            </CardDescription>
          </div>
          <Badge className={`flex items-center ${eventType.color}`}>
            {eventType.icon}
            {eventType.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
        
        {event.image && (
          <div className="mb-3 h-36 overflow-hidden rounded-md">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        <div className="flex flex-col space-y-1 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Speaker</span>
            <span>{event.speaker}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span>{event.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Attendees</span>
            <span>{event.attendees}/{event.capacity}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleRSVP} 
          className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
          disabled={event.attendees >= event.capacity}
        >
          {event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

const Events = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(new Date());
  const [viewType, setViewType] = useState('calendar');
  const [events, setEvents] = useState(EVENTS);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleCreateEvent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create events will be available in a future update.",
    });
  };

  const handleRSVP = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  // Filter events for the current month
  const currentMonthEvents = events.filter(event => 
    event.date.getMonth() === month.getMonth() && 
    event.date.getFullYear() === month.getFullYear()
  );

  const handlePreviousMonth = () => {
    setMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Type buttons for filtering
  const typeFilters = Object.entries(EVENT_TYPES).map(([type, details]) => (
    <Badge 
      key={type} 
      className={`cursor-pointer ${details.color} flex items-center gap-1 mb-2 mr-2`}
    >
      {details.icon}
      {details.label}
    </Badge>
  ));

  return (
    <MainLayout title="Events">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Community Events</h1>
          <div className="flex items-center gap-3">
            <div className="border rounded-lg flex overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-none ${viewType === 'calendar' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('calendar')}
              >
                <CalendarIcon size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-none ${viewType === 'list' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('list')}
              >
                <List size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-none ${viewType === 'grid' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('grid')}
              >
                <Grid size={16} />
              </Button>
            </div>
            <Button 
              onClick={handleCreateEvent}
              className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
            >
              <Plus size={16} />
              <span>New Event</span>
            </Button>
          </div>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap mb-4">
          {typeFilters}
        </div>

        {viewType === 'calendar' && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60}>
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {format(month, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                        <ChevronLeft size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-md border"
                    disabled={{ before: new Date() }}
                    modifiers={{
                      event: currentMonthEvents.map(event => new Date(event.date)),
                    }}
                    modifiersStyles={{
                      event: { 
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        color: 'var(--nortech-purple, #8b5cf6)' 
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={40}>
              <div className="pl-4">
                <h2 className="text-lg font-medium mb-4">
                  {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
                </h2>
                
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(event => (
                    <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      <p>No events scheduled for this date.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {viewType === 'list' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </CardHeader>
            <CardContent>
              {currentMonthEvents.length > 0 ? (
                currentMonthEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
                  ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No events scheduled for this month.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {viewType === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMonthEvents.length > 0 ? (
              currentMonthEvents.map(event => {
                const eventType = EVENT_TYPES[event.type];
                return (
                  <Card key={event.id} className="flex flex-col">
                    {event.image && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover rounded-t-lg" 
                        />
                      </div>
                    )}
                    <CardHeader className={`pb-2 ${!event.image ? 'pt-6' : 'pt-4'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {format(event.date, 'MMMM d, yyyy')} • {event.time}
                          </CardDescription>
                        </div>
                        <Badge className={`flex items-center ${eventType.color}`}>
                          {eventType.icon}
                          {eventType.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6 flex-grow">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                      <div className="flex flex-col space-y-1 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Speaker</span>
                          <span>{event.speaker}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Attendees</span>
                          <span>{event.attendees}/{event.capacity}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="mt-auto px-6 pb-6">
                      <Button 
                        className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
                        onClick={() => handleRSVP(event.id)}
                        disabled={event.attendees >= event.capacity}
                      >
                        {event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                <p>No events scheduled for this month.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
