
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EVENTS } from '@/components/events/data/EventsMockData';
import WeeklyCalendarView from '@/components/events/WeeklyCalendarView';
import EventTypeFilter, { EventTypeKey } from '@/components/events/EventTypeFilter';
import { useNotifications } from '@/context/NotificationsContext';

const EventsWeekly = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [allEvents, setAllEvents] = useState(EVENTS);
  const [filteredEvents, setFilteredEvents] = useState(EVENTS);
  const [selectedTypes, setSelectedTypes] = useState<EventTypeKey[]>(
    Object.keys(EVENTS.reduce((types, event) => ({ ...types, [event.type]: true }), {})) as EventTypeKey[]
  );
  const { toast } = useToast();
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
      
      // Add to notifications system
      addNotification({
        type: 'event',
        title: 'Event Registration Confirmed',
        message: `You're registered for "${event.title}" on ${event.date.toLocaleDateString()}`,
        link: '/events/weekly',
      });
    }
    
    // Update the event's attendees count and registered users
    setAllEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              attendees: event.attendees + 1,
              registeredUsers: [...(event.registeredUsers || []), 'current-user'] 
            }
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

        <div className="mb-4">
          <EventTypeFilter 
            selectedTypes={selectedTypes}
            onChange={setSelectedTypes}
          />
        </div>

        <WeeklyCalendarView 
          events={filteredEvents}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          onRSVP={handleRSVP}
        />
      </div>
    </MainLayout>
  );
};

export default EventsWeekly;
