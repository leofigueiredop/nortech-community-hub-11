
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { EVENTS } from '@/components/events/EventTypes';
import EventsHeader from '@/components/events/EventsHeader';
import CalendarView from '@/components/events/CalendarView';
import EventsList from '@/components/events/EventsList';
import EventGrid from '@/components/events/EventGrid';

const Events = () => {
  const [viewType, setViewType] = useState('calendar');
  const [events, setEvents] = useState(EVENTS);
  const { toast } = useToast();

  const handleRSVP = (eventId: number) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  // Filter events for the current month
  const currentMonthEvents = events.filter(event => {
    const now = new Date();
    return event.date.getMonth() === now.getMonth() && 
           event.date.getFullYear() === now.getFullYear();
  });

  return (
    <MainLayout title="Events">
      <div className="mb-6">
        <EventsHeader viewType={viewType} setViewType={setViewType} />

        {viewType === 'calendar' && (
          <CalendarView events={events} onRSVP={handleRSVP} />
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
