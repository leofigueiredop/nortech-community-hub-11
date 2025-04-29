
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from './types/EventTypes';

interface EventCardProps {
  event: Event;
  viewType?: 'grid' | 'list';
  onRSVP: (eventId: number) => void;
  onOpenAttendanceModal?: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  viewType = 'grid',
  onRSVP,
  onOpenAttendanceModal,
}) => {
  const isGrid = viewType === 'grid';
  const isPast = new Date(event.date) < new Date();
  const isRegistered = event.isRegistered;
  
  // Convert string to number if needed
  const handleRSVP = () => {
    const eventId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id;
    onRSVP(eventId);
  };
  
  // Convert string to number if needed
  const handleOpenAttendance = () => {
    if (!onOpenAttendanceModal) return;
    const eventId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id;
    onOpenAttendanceModal(eventId);
  };

  const renderEventDate = () => {
    return (
      <div className={`flex items-center gap-1 text-sm text-gray-500`}>
        <Calendar size={16} />
        <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
      </div>
    );
  };

  const renderEventTime = () => {
    return (
      <div className={`flex items-center gap-1 text-sm text-gray-500`}>
        <Clock size={16} />
        <span>{format(new Date(event.date), 'h:mm a')}</span>
      </div>
    );
  };

  const renderEventLocation = () => {
    return (
      <div className={`flex items-center gap-1 text-sm text-gray-500`}>
        <MapPin size={16} />
        <span className="truncate">{event.location || 'Online'}</span>
      </div>
    );
  };

  const renderAttendees = () => {
    return (
      <div className={`flex items-center gap-1 text-sm text-gray-500`}>
        <Users size={16} />
        <span>{event.attendees || 0} registered</span>
      </div>
    );
  };

  const renderPoints = () => {
    if (!event.pointsValue) return null;
    return (
      <div className={`flex items-center gap-1 text-sm text-amber-600`}>
        <Star size={16} />
        <span>{event.pointsValue} points</span>
      </div>
    );
  };

  if (isGrid) {
    return (
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img
            src={event.imageUrl || 'https://via.placeholder.com/300x150?text=Event'}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          {event.isPremium && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600">
              Premium
            </Badge>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
            {renderEventDate()}
            {renderEventTime()}
            {renderEventLocation()}
            {renderAttendees()}
            {renderPoints()}
          </div>
          
          <div className="mt-auto">
            {isPast ? (
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={!isRegistered} 
                onClick={handleOpenAttendance}
              >
                {isRegistered ? 'View Attendance' : 'Event Ended'}
              </Button>
            ) : (
              <Button 
                className="w-full" 
                variant={isRegistered ? "outline" : "default"} 
                onClick={handleRSVP} 
                disabled={isRegistered}
              >
                {isRegistered ? 'Registered' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-64">
          <img
            src={event.imageUrl || 'https://via.placeholder.com/300x150?text=Event'}
            alt={event.title}
            className="w-full h-48 md:h-full object-cover"
          />
          {event.isPremium && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600">
              Premium
            </Badge>
          )}
        </div>

        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
          
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-4">
            {renderEventDate()}
            {renderEventTime()}
            {renderEventLocation()}
            {renderAttendees()}
            {renderPoints()}
          </div>
          
          <div className="flex justify-end mt-4">
            {isPast ? (
              <Button 
                variant="outline" 
                disabled={!isRegistered} 
                onClick={handleOpenAttendance}
              >
                {isRegistered ? 'View Attendance' : 'Event Ended'}
              </Button>
            ) : (
              <Button 
                variant={isRegistered ? "outline" : "default"} 
                onClick={handleRSVP} 
                disabled={isRegistered}
              >
                {isRegistered ? 'Registered' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
