
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, List, Grid } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';
import { useNotifications } from '@/context/NotificationsContext';
import EventsList from '@/components/events/EventsList';
import EventGrid from '@/components/events/EventGrid';
import { mockEvents } from '@/components/events/data/EventsMockData';
import { EventType } from '@/components/events/types/EventTypes';
import EventConfirmDialog from '@/components/events/EventConfirmDialog';

const Events = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [allEvents, setAllEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [confirmEvent, setConfirmEvent] = useState<number | null>(null);
  const [selectedPremiumFilter, setSelectedPremiumFilter] = useState<'all' | 'premium' | 'free'>('all');
  
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  const { addNotification } = useNotifications();

  // Filter events based on premium status
  useEffect(() => {
    let events = [...allEvents];
    
    if (selectedPremiumFilter === 'premium') {
      events = events.filter(event => event.isPremium);
    } else if (selectedPremiumFilter === 'free') {
      events = events.filter(event => !event.isPremium);
    }
    
    setFilteredEvents(events);
  }, [selectedPremiumFilter, allEvents]);

  // RSVP handler
  const handleRSVP = (eventId: number) => {
    // Show confirmation dialog first
    setConfirmEvent(eventId);
  };
  
  // Confirm RSVP after dialog
  const confirmRSVP = () => {
    if (!confirmEvent) return;
    
    // Get the event that is being registered for
    const event = allEvents.find(e => e.id === confirmEvent);
    
    if (event) {
      // Show toast notification
      toast({
        title: "Registration Confirmed",
        description: `You've successfully registered for "${event.title}"`,
      });
      
      // Award points for registering to an event
      awardPoints({
        type: "event_registration",
        description: `Registered for ${event.title}`,
        points: 10
      });
      
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
        event.id === confirmEvent 
          ? { 
              ...event, 
              attendees: event.attendees + 1,
              isRegistered: true,
              registeredUsers: [...(event.registeredUsers || []), 'current-user'] 
            }
          : event
      )
    );
    
    // Clear the confirmEvent state
    setConfirmEvent(null);
  };

  const handleAttendanceModal = (eventId: number) => {
    // This would open a modal to manage attendance
    console.log(`Open attendance modal for event ID: ${eventId}`);
  };

  return (
    <MainLayout title="Events">
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover and attend upcoming community events
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
              <Button
                variant={selectedPremiumFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPremiumFilter('all')}
                className="rounded-sm text-xs"
              >
                All
              </Button>
              <Button
                variant={selectedPremiumFilter === 'premium' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPremiumFilter('premium')}
                className="rounded-sm text-xs"
              >
                Premium
              </Button>
              <Button
                variant={selectedPremiumFilter === 'free' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPremiumFilter('free')}
                className="rounded-sm text-xs"
              >
                Free
              </Button>
            </div>
            
            <div className="hidden md:flex border rounded-lg overflow-hidden">
              <Button 
                variant={viewType === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewType('list')}
                className="rounded-none flex items-center gap-2"
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button 
                variant={viewType === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewType('grid')}
                className="rounded-none flex items-center gap-2"
              >
                <Grid size={16} />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
            
            <Link to="/create-event">
              <Button className="bg-nortech-purple hover:bg-nortech-purple/90">
                <Plus size={16} className="mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {viewType === 'grid' ? (
          <EventGrid 
            events={filteredEvents} 
            viewType={viewType} 
            onRSVP={handleRSVP} 
            onOpenAttendanceModal={handleAttendanceModal}
          />
        ) : (
          <EventsList 
            events={filteredEvents} 
            onRSVP={handleRSVP} 
            onOpenAttendanceModal={handleAttendanceModal}
          />
        )}
        
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
        
        {/* Event confirmation dialog */}
        <EventConfirmDialog
          isOpen={confirmEvent !== null}
          onClose={() => setConfirmEvent(null)}
          onConfirm={confirmRSVP}
          event={allEvents.find(e => e.id === confirmEvent) || null}
        />
      </div>
    </MainLayout>
  );
};

export default Events;
