
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, EVENT_TYPES } from './EventTypes';

interface WeeklyEventCardProps {
  event: Event;
  onRSVP: (eventId: number) => void;
}

const WeeklyEventCard: React.FC<WeeklyEventCardProps> = ({ event, onRSVP }) => {
  const eventType = EVENT_TYPES[event.type];
  
  return (
    <div 
      className="mb-2 p-2 rounded-md border bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-sm">{event.title}</div>
        <Badge className={eventType.color}>
          {eventType.icon}
          {eventType.label}
        </Badge>
      </div>
      <div className="text-xs text-gray-500 mb-1">{event.time}</div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs mt-1 h-6"
        onClick={() => onRSVP(event.id)}
        disabled={event.attendees >= event.capacity}
      >
        {event.attendees >= event.capacity ? "Full" : "RSVP"}
      </Button>
    </div>
  );
};

export default WeeklyEventCard;
