
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EVENT_TYPES, Event } from './EventTypes';

interface EventGridProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
}

const EventGrid: React.FC<EventGridProps> = ({ events, onRSVP }) => {
  if (events.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-gray-500">
        <p>No events scheduled for this month.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => {
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
              <div className="mt-auto">
                <Button 
                  className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
                  onClick={() => onRSVP(event.id)}
                  disabled={event.attendees >= event.capacity}
                >
                  {event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EventGrid;
