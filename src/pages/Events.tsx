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
import type { Event as RawEvent } from '@/types/events';
import type { EventWithUI, EventType } from '@/components/events/types/EventTypes';
import EventConfirmDialog from '@/components/events/EventConfirmDialog';
import CalendarView from '@/components/events/CalendarView';
import { format } from 'date-fns';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import EventsHeader from '@/components/events/EventsHeader';
import EventFilters from '@/components/events/filters/EventFilters';
import ViewTypeSwitcher from '@/components/events/ViewTypeSwitcher';
import { useRealEvents } from '@/hooks/useRealEvents';
import { adaptEventForComponent } from '@/components/events/utils/EventTypeAdapter';

// Define view type for the events
type ViewType = 'grid' | 'list' | 'calendar';

const Events = () => {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [allEvents, setAllEvents] = useState<EventWithUI[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithUI[]>([]);
  const [confirmEvent, setConfirmEvent] = useState<number | null>(null);
  const [selectedPremiumFilter, setSelectedPremiumFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<EventType[]>(['workshop', 'webinar', 'meetup', 'conference']);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  const { addNotification } = useNotifications();
  const { 
    loading: eventsLoading, 
    events, 
    upcomingEvents,
    registerForEvent: registerForEventApi,
    loadAllEvents,
    filterEvents
  } = useRealEvents();

  // Load events on component mount
  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  // Update all events when events change
  useEffect(() => {
    if (events.length > 0) {
      // Convert Supabase events to the component format if needed
      const adaptedEvents = events.map(event => adaptEventForComponent(event));
      setAllEvents(adaptedEvents);
    }
  }, [events]);

  // Filter events based on premium status, type, and availability
   useEffect(() => {
    if (events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    // 1) aplica o filtro ao array cru
    const rawFiltered = filterEvents(events, {
      isPremium: selectedPremiumFilter === 'all'
        ? undefined
        : selectedPremiumFilter === 'premium',
      type: selectedTypeFilters,
      showAvailableOnly,
      selectedDate,
    });

    // 2) adapta cada RawEvent para EventWithUI
    const uiFiltered = rawFiltered.map(adaptEventForComponent);

    setFilteredEvents(uiFiltered);
  }, [
    events,                    // <<< usa o array cru aqui, não allEvents
    selectedPremiumFilter,
    selectedTypeFilters,
    showAvailableOnly,
    selectedDate,
    filterEvents,
  ]);


  // RSVP handler
  const handleRSVP = (eventId: number) => {
    setConfirmEvent(eventId);
  };
  
  // Confirm RSVP after dialog
  const confirmRSVP = async () => {
    if (!confirmEvent) return;
    
    const event = allEvents.find(e => Number(e.id) === confirmEvent);
    
    if (event) {
      const success = await registerForEventApi(confirmEvent);
      
      if (success) {
        toast({
          title: "Registration Confirmed",
          description: `You've successfully registered for "${event.title}"`,
        });
        
        awardPoints(
          5,
          `Registered for ${event.title}`
        );
        
        addNotification({
          type: 'event',
          title: 'Event Registration Confirmed',
          message: `You're registered for "${event.title}" on ${format(new Date(event.date), 'dd/MM/yyyy')}`,
          link: '/events',
        });
      }
    }
    
    setConfirmEvent(null);
  };

  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && window.innerWidth < 768) {
      setIsDrawerOpen(true);
    }
  };

  const eventsForSelectedDate = selectedDate 
    ? filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDate.getDate() && 
               eventDate.getMonth() === selectedDate.getMonth() &&
               eventDate.getFullYear() === selectedDate.getFullYear();
      })
    : [];

  return (
    <MainLayout title="Events">
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <EventsHeader />
          
          {/* Filters section */}
          <EventFilters 
            selectedPremiumFilter={selectedPremiumFilter}
            setSelectedPremiumFilter={setSelectedPremiumFilter}
            selectedTypeFilters={selectedTypeFilters}
            setSelectedTypeFilters={setSelectedTypeFilters}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
          />
          
          {/* View type tabs */}
          <Tabs 
            defaultValue={viewType} 
            onValueChange={(v) => setViewType(v as ViewType)}
            className="w-full"
          >
            <ViewTypeSwitcher
              viewType={viewType}
              onViewTypeChange={(v) => setViewType(v as ViewType)}
              selectedDate={selectedDate}
              onDateClear={() => setSelectedDate(undefined)}
            />

            <TabsContent value="grid">
              {eventsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="spinner animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <EventGrid 
                  events={filteredEvents} 
                  viewType="grid"
                  onRSVP={handleRSVP} 
                  onOpenAttendanceModal={() => {}}
                />
              )}
            </TabsContent>
            
            <TabsContent value="list">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="spinner animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <EventsList 
                  events={filteredEvents} 
                  onRSVP={handleRSVP} 
                  onOpenAttendanceModal={() => {}}
                />
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="md:flex space-x-4">
              {loading ? (
                <div className="flex justify-center items-center py-12 w-full">
                  <div className="spinner animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className={`md:w-[60%] ${selectedDate && window.innerWidth >= 768 ? '' : 'w-full'}`}>
                    <CalendarView 
                      events={allEvents} 
                      onRSVP={handleRSVP}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                  
                  {selectedDate && window.innerWidth >= 768 && (
                    <div className="hidden md:block md:w-[40%] border-l pl-4">
                      <h3 className="font-medium text-lg mb-4">
                        Events on {format(selectedDate, 'dd/MM/yyyy')}
                      </h3>
                      
                      {eventsForSelectedDate.length > 0 ? (
                        <div className="space-y-4">
                          {eventsForSelectedDate.map((event) => (
                            <div key={event.id} className="border rounded-md p-4">
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-500">{event.time}</p>
                              <p className="text-sm mt-2">{event.description.substring(0, 100)}...</p>
                              <div className="mt-3">
                                <Button 
                                  size="sm" 
                                  className="bg-nortech-purple hover:bg-nortech-purple/90"
                                  onClick={() => handleRSVP(Number(event.id))}
                                  disabled={(event.attendees || 0) >= (event.capacity || 0)}
                                >
                                  {(event.attendees || 0) >= (event.capacity || 0) ? "No spots left" : "Register"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No events scheduled for this date.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile drawer for calendar view */}
      <Sheet open={isDrawerOpen && !!selectedDate} onOpenChange={setIsDrawerOpen}>
        <SheetContent>
          <div className="px-1">
            <h3 className="font-medium text-lg mb-4">
              Events on {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            </h3>
            
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="border rounded-md p-4">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.time}</p>
                    <p className="text-sm mt-2">{event.description.substring(0, 100)}...</p>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        className="bg-nortech-purple hover:bg-nortech-purple/90"
                        onClick={() => handleRSVP(Number(event.id))}
                        disabled={(event.attendees || 0) >= (event.capacity || 0)}
                      >
                        {(event.attendees || 0) >= (event.capacity || 0) ? "No spots left" : "Register"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled for this date.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Event registration confirmation dialog */}
      <EventConfirmDialog 
        open={!!confirmEvent}
        onOpenChange={(open) => {
          if (!open) setConfirmEvent(null);
        }}
        onConfirm={confirmRSVP}
        event={allEvents.find(e => Number(e.id) === confirmEvent) || null}
      />
    </MainLayout>
  );
};

export default Events;
