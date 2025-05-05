import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockEvents } from '@/components/events/data/EventsMockData';
import CalendarView from '@/components/events/CalendarView';
import EventTypeFilter from '@/components/events/EventTypeFilter';
import { useNotifications } from '@/context/NotificationsContext';
import { EventType } from '@/components/events/types/EventTypes';
import { usePoints } from '@/context/PointsContext';
import EventConfirmDialog from '@/components/events/EventConfirmDialog';
import { useTranslation } from 'react-i18next';

const EventsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allEvents, setAllEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(
    Object.keys(mockEvents.reduce((types, event) => ({ ...types, [event.type]: true }), {})) as EventType[]
  );
  const [confirmEvent, setConfirmEvent] = useState<number | null>(null);
  const [selectedPremiumFilter, setSelectedPremiumFilter] = useState<'all' | 'premium' | 'free'>('all');
  
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { awardPoints } = usePoints();
  const { t } = useTranslation();

  // Filter events when selectedTypes or premium filter changes
  useEffect(() => {
    let filtered = allEvents;
    
    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => selectedTypes.includes(event.type));
    } else {
      filtered = [];
    }
    
    // Filter by premium status
    if (selectedPremiumFilter === 'premium') {
      filtered = filtered.filter(event => event.isPremium);
    } else if (selectedPremiumFilter === 'free') {
      filtered = filtered.filter(event => !event.isPremium);
    }
    
    setFilteredEvents(filtered);
  }, [selectedTypes, allEvents, selectedPremiumFilter]);

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
        link: '/events/calendar',
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

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <MainLayout title={t('events.calendar.title')}>
      <div className="container py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{t('events.calendar.title')}</h1>
              <p className="text-muted-foreground">{t('events.calendar.description')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1 mr-2">
                <Button
                  variant={selectedPremiumFilter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPremiumFilter('all')}
                  className="rounded-sm text-xs"
                >
                  {t('events.calendar.filter.all')}
                </Button>
                <Button
                  variant={selectedPremiumFilter === 'premium' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPremiumFilter('premium')}
                  className="rounded-sm text-xs"
                >
                  {t('events.calendar.filter.premium')}
                </Button>
                <Button
                  variant={selectedPremiumFilter === 'free' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPremiumFilter('free')}
                  className="rounded-sm text-xs"
                >
                  {t('events.calendar.filter.free')}
                </Button>
              </div>
              
              <div className="border rounded-lg flex overflow-hidden">
                <Link to="/events/calendar">
                  <Button variant="ghost" size="sm" className="rounded-none bg-muted">
                    <Calendar size={16} className="mr-2" />
                    <span>{t('events.calendar.button.calendar')}</span>
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="rounded-none">
                    <List size={16} className="mr-2" />
                    <span>{t('events.calendar.button.list')}</span>
                  </Button>
                </Link>
              </div>
              
              <Link to="/create-event">
                <Button className="bg-nortech-purple hover:bg-nortech-purple/90">
                  {t('events.calendar.button.create')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex ml-4">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-8 w-8">
                  &lt;
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8 ml-2">
                  &gt;
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              {t('events.calendar.button.today')}
            </Button>
          </div>

          <div className="mb-4">
            <EventTypeFilter 
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
            />
          </div>

          <CalendarView 
            events={filteredEvents} 
            onRSVP={handleRSVP}
          />
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

export default EventsCalendar;
