
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { EVENTS } from '@/components/events/EventTypes';
import EventsHeader from '@/components/events/EventsHeader';
import CalendarView from '@/components/events/CalendarView';
import EventsList from '@/components/events/EventsList';
import EventGrid from '@/components/events/EventGrid';
import EventTypeFilter, { EventTypeKey } from '@/components/events/EventTypeFilter';

const Events = () => {
  const [viewType, setViewType] = useState('calendar');
  const [allEvents, setAllEvents] = useState(EVENTS);
  const [filteredEvents, setFilteredEvents] = useState(EVENTS);
  const [selectedTypes, setSelectedTypes] = useState<EventTypeKey[]>(
    Object.keys(EVENTS.reduce((types, event) => ({ ...types, [event.type]: true }), {})) as EventTypeKey[]
  );
  const { toast } = useToast();

  // Filter events when selectedTypes changes
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredEvents([]);
    } else {
      setFilteredEvents(allEvents.filter(event => selectedTypes.includes(event.type)));
    }
  }, [selectedTypes, allEvents]);

  const handleRSVP = (eventId: number) => {
    setAllEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  // Filter events for the current month
  const currentMonthEvents = filteredEvents.filter(event => {
    const now = new Date();
    return event.date.getMonth() === now.getMonth() && 
           event.date.getFullYear() === now.getFullYear();
  });

  return (
    <MainLayout title="Events">
      <div className="mb-6">
        <EventsHeader viewType={viewType} setViewType={setViewType} />

        <div className="mb-4 mt-2">
          <EventTypeFilter 
            selectedTypes={selectedTypes}
            onChange={setSelectedTypes}
          />
        </div>

        {viewType === 'calendar' && (
          <CalendarView events={filteredEvents} onRSVP={handleRSVP} />
        )}

        {viewType === 'list' && (
          <EventsList events={currentMonthEvents} onRSVP={handleRSVP} />
        )}

        {viewType === 'grid' && (
          <EventGrid events={currentMonthEvents} onRSVP={handleRSVP} />
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
