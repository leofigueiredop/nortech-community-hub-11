
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, List } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';
import { useNotifications } from '@/context/NotificationsContext';
import EventsList from '@/components/events/EventsList';
import EventGrid from '@/components/events/EventGrid';
import EventsHeader from '@/components/events/EventsHeader';
import EventTypeFilter from '@/components/events/EventTypeFilter';
import { mockEvents } from '@/components/events/data/EventsMockData';
import { EventType } from '@/components/events/types/EventTypes';

const Events = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [allEvents, setAllEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(
    Object.keys(mockEvents.reduce((types, event) => ({ ...types, [event.type]: true }), {})) as EventType[]
  );
  
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  const { addNotification } = useNotifications();

  // Filter events when selectedTypes changes
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredEvents([]);
    } else {
      setFilteredEvents(allEvents.filter(event => selectedTypes.includes(event.type)));
    }
  }, [selectedTypes, allEvents]);

  // RSVP handler
  const handleRSVP = (eventId: number) => {
    // Get the event that is being registered for
    const event = allEvents.find(e => e.id === eventId);
    
    if (event) {
      // Show toast notification
      toast({
        title: "Registration Confirmed",
        description: `You've successfully registered for "${event.title}"`,
      });
      
      // Award points for registering to an event
      awardPoints(10, `Registered for ${event.title}`);
      
      // Add to notifications system
      addNotification({
        type: 'event',
        title: 'Event Registration Confirmed',
        message: `You're registered for "${event.title}" on ${event.date.toLocaleDateString()}`,
        link: '/events',
      });
    }
    
    // Update the event's attendees count and registered users
    setAllEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              attendees: event.attendees + 1,
              isRegistered: true,
              registeredUsers: [...(event.registeredUsers || []), 'current-user'] 
            }
          : event
      )
    );
  };

  const handleAttendanceModal = (eventId: number) => {
    // This would open a modal to manage attendance
    console.log(`Open attendance modal for event ID: ${eventId}`);
  };

  return (
    <MainLayout title="Events">
      <div className="container py-6">
        <EventsHeader 
          viewType={viewType} 
          setViewType={setViewType}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <div className="mb-6">
          <EventTypeFilter 
            selectedTypes={selectedTypes}
            onChange={setSelectedTypes}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover and attend upcoming community events
            </p>
          </div>
          
          <Link to="/create-event">
            <Button className="bg-nortech-purple hover:bg-nortech-purple/90">
              <Plus size={16} className="mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger 
              value="grid" 
              onClick={() => setViewType('grid')}
              className="flex items-center gap-2"
            >
              <Calendar size={16} />
              Grid View
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              onClick={() => setViewType('list')}
              className="flex items-center gap-2"
            >
              <List size={16} />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid">
            <EventGrid 
              events={filteredEvents} 
              viewType={viewType} 
              onRSVP={handleRSVP} 
              onOpenAttendanceModal={handleAttendanceModal}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <EventsList 
              events={filteredEvents} 
              onRSVP={handleRSVP} 
              onOpenAttendanceModal={handleAttendanceModal}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground mb-3">
            Looking for more viewing options?
          </div>
          <div className="flex gap-4 justify-center">
            <Link to="/events/calendar">
              <Button variant="outline" className="min-w-32">
                <Calendar size={16} className="mr-2" />
                Calendar View
              </Button>
            </Link>
            <Link to="/events/weekly">
              <Button variant="outline" className="min-w-32">
                <Calendar size={16} className="mr-2" />
                Weekly Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
