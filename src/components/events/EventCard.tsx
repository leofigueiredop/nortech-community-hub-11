
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES, Event } from './types/EventTypes'; 
import { useNotifications } from '@/context/NotificationsContext';
import EventAttendanceManager from './attendance/EventAttendanceManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EventDetailModal from './EventDetailModal';

// Import the new smaller components
import EventCardHeader from './card/EventCardHeader';
import EventCardDetails from './card/EventCardDetails';
import EventCardActions from './card/EventCardActions';
import EventCalendarButtons from './card/EventCalendarButtons';

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string | number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP }) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Get the event status
  const status = event.status || 'upcoming';
  
  // Check if current user is registered
  const isRegistered = event.isRegistered || false;
  
  const handleRSVP = () => {
    // RSVP for the event
    onRSVP(event.id);
  };

  // Convert the event.id to string for the EventAttendanceManager
  const eventIdString = typeof event.id === 'number' ? String(event.id) : event.id;

  // Calculate attendees as number
  const attendeesCount = typeof event.attendees === 'string' 
    ? parseInt(event.attendees, 10) 
    : (event.attendees || 0);
    
  // Calculate capacity as number
  const capacityCount = event.capacity ? Number(event.capacity) : 0;

  return (
    <>
      <Card 
        className="mb-4 cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => setShowDetailModal(true)}
      >
        <EventCardHeader 
          title={event.title}
          date={event.date}
          time={event.time || ''}
          type={event.type || 'other'}
          status={status}
          isRegistered={isRegistered}
          isPremium={event.isPremium}
        />
        
        <CardContent>
          <EventCardDetails 
            description={event.description}
            image={event.image || ''}
            speaker={event.speaker || ''}
            location={event.location}
            attendees={attendeesCount}
            capacity={capacityCount}
          />
          
          <div onClick={(e) => e.stopPropagation()}>
            <EventCardActions 
              status={status}
              isRegistered={isRegistered}
              attendees={attendeesCount}
              capacity={capacityCount}
              onRSVP={handleRSVP}
              onOpenAttendanceModal={() => setShowAttendanceModal(true)}
              isPremium={event.isPremium}
            />
            
            <EventCalendarButtons 
              title={event.title}
              date={event.date}
              time={event.time || ''}
              description={event.description}
              location={event.location}
              isRegistered={isRegistered}
              status={status}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Attendance management dialog */}
      <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attendance Management - {event.title}</DialogTitle>
          </DialogHeader>
          <EventAttendanceManager eventId={eventIdString} eventTitle={event.title} />
        </DialogContent>
      </Dialog>

      {/* Event detail modal */}
      <EventDetailModal 
        event={event}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onRSVP={onRSVP}
      />
    </>
  );
};

export default EventCard;

export const parseAttendeeCount = (count: string | number): number => {
  if (typeof count === 'string') {
    return parseInt(count, 10) || 0;
  }
  return count || 0;
};
