
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES, Event } from './types/EventTypes'; 
import { getEventStatus, isUserRegistered } from './utils/EventUtils';
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
  onRSVP: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP }) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Get the event status
  const status = event.status || getEventStatus(event);
  
  // Check if current user is registered (for demo, always using 'current-user')
  const isRegistered = isUserRegistered(event);
  
  const handleRSVP = () => {
    // RSVP for the event
    onRSVP(event.id);
  };

  return (
    <>
      <Card 
        className="mb-4 cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => setShowDetailModal(true)}
      >
        <EventCardHeader 
          title={event.title}
          date={event.date}
          time={event.time}
          type={event.type}
          status={status}
          isRegistered={isRegistered}
          isPremium={event.isPremium}
        />
        
        <CardContent>
          <EventCardDetails 
            description={event.description}
            image={event.image}
            speaker={event.speaker}
            location={event.location}
            attendees={event.attendees}
            capacity={event.capacity}
          />
          
          <div onClick={(e) => e.stopPropagation()}>
            <EventCardActions 
              status={status}
              isRegistered={isRegistered}
              attendees={event.attendees}
              capacity={event.capacity}
              onRSVP={handleRSVP}
              onOpenAttendanceModal={() => setShowAttendanceModal(true)}
              isPremium={event.isPremium}
            />
            
            <EventCalendarButtons 
              title={event.title}
              date={event.date}
              time={event.time}
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
          <EventAttendanceManager eventId={event.id} eventTitle={event.title} />
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
