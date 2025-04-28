
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, Clock } from 'lucide-react';
import { Event, EVENT_TYPES } from './types/EventTypes';
import { getEventStatus, isUserRegistered } from './utils/EventUtils';

interface WeeklyEventCardProps {
  event: Event;
  onRSVP: (eventId: number) => void;
}

const WeeklyEventCard: React.FC<WeeklyEventCardProps> = ({ event, onRSVP }) => {
  const eventType = EVENT_TYPES[event.type];
  
  // Get the event status directly from the event or use the utility
  const status = event.status || getEventStatus({
    ...event,
    start_date: event.start_date || event.date.toISOString(),
    end_date: event.end_date || new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    date: undefined // Ensure we're using the correct date field
  });
  
  // Check if current user is registered
  const isRegistered = isUserRegistered({
    ...event,
    start_date: event.start_date || event.date.toISOString(),
    end_date: event.end_date || new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    date: undefined // Ensure we're using the correct date field
  });
  
  return (
    <div 
      className="mb-2 p-2 rounded-md border bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-sm">{event.title}</div>
        <div className="flex flex-col gap-1 items-end">
          <Badge className={eventType.color}>
            {eventType.icon}
            {eventType.label}
          </Badge>
          
          {/* Status badges */}
          {status === 'happening_soon' && (
            <Badge variant="outline" className="text-[10px] h-4 bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock size={10} className="mr-1" />
              Soon
            </Badge>
          )}
          {isRegistered && (
            <Badge variant="outline" className="text-[10px] h-4 bg-green-100 text-green-800 border-green-200">
              <Check size={10} className="mr-1" />
              Registered
            </Badge>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-1">{event.time}</div>
      
      {/* RSVP Button or Add to Calendar */}
      {status !== 'ended' && !isRegistered ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs mt-1 h-6"
          onClick={() => onRSVP(event.id)}
          disabled={event.attendees >= event.capacity}
        >
          {event.attendees >= event.capacity ? "Full" : "Register"}
        </Button>
      ) : isRegistered ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs mt-1 h-6 bg-green-50"
          onClick={() => {
            // Generate Google Calendar link and open it
            const startDateTime = new Date(event.date);
            const [startHour, startMinute] = event.time.split(' - ')[0].split(':');
            startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
            
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + 2);
            
            const startStr = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
            const endStr = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
            
            const calLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
            
            window.open(calLink, '_blank');
          }}
        >
          <Calendar size={12} className="mr-1" />
          Add to Calendar
        </Button>
      ) : (
        <div className="text-xs text-gray-400 text-center mt-1">
          Event ended
        </div>
      )}
    </div>
  );
};

export default WeeklyEventCard;
