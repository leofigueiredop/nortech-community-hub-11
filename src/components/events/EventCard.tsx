
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES } from './EventTypes';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: Date;
    time: string;
    type: keyof typeof EVENT_TYPES;
    location: string;
    speaker: string;
    attendees: number;
    capacity: number;
    image: string | null;
  };
  onRSVP: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP }) => {
  const eventType = EVENT_TYPES[event.type];
  const { toast } = useToast();
  
  const handleRSVP = () => {
    toast({
      title: "RSVP Confirmed",
      description: `You've successfully registered for "${event.title}"`,
    });
    onRSVP(event.id);
  };

  return (
    <Card className="mb-4">
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
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
        
        {event.image && (
          <div className="mb-3 h-36 overflow-hidden rounded-md">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        <div className="flex flex-col space-y-1 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Speaker</span>
            <span>{event.speaker}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span>{event.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Attendees</span>
            <span>{event.attendees}/{event.capacity}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleRSVP} 
          className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
          disabled={event.attendees >= event.capacity}
        >
          {event.attendees >= event.capacity ? "Fully Booked" : "RSVP Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
