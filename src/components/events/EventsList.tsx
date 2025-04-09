
import React from 'react';
import { Event } from './EventTypes';
import EventCard from './EventCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface EventsListProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, onRSVP }) => {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <p>No events scheduled for this month.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
      </CardHeader>
      <CardContent>
        {events
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(event => (
            <EventCard key={event.id} event={event} onRSVP={onRSVP} />
          ))
        }
      </CardContent>
    </Card>
  );
};

export default EventsList;
