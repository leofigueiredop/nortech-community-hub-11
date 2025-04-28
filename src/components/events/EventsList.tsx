
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event, EVENT_TYPES } from './types/EventTypes';

interface EventsListProps {
  events: Event[];
  onRSVP: (eventId: string | number) => void;
  onOpenAttendanceModal: (eventId: string | number) => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, onRSVP, onOpenAttendanceModal }) => {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No events scheduled for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => {
        const eventType = EVENT_TYPES[event.type];
        const isRegistered = event.isRegistered || false;
        
        return (
          <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden">
            {event.image && (
              <div className="md:w-1/4 h-40 md:h-auto overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className={`flex-1 ${!event.image ? 'md:pl-6' : ''}`}>
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
              <CardContent className="pb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between sm:justify-start sm:gap-6">
                      <span className="text-gray-500 sm:w-20">Speaker</span>
                      <span>{event.speaker}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-6">
                      <span className="text-gray-500 sm:w-20">Attendees</span>
                      <span>{event.attendees}/{event.capacity}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-nortech-purple hover:bg-nortech-purple/90 text-white"
                      onClick={() => onRSVP(event.id)}
                      disabled={event.attendees >= event.capacity || isRegistered}
                    >
                      {isRegistered ? "Registered" : event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EventsList;
