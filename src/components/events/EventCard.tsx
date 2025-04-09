
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES, Event } from './types/EventTypes'; 
import { getEventStatus, isUserRegistered } from './utils/EventUtils';
import { useNotifications } from '@/context/NotificationsContext';
import EventAttendanceManager from './attendance/EventAttendanceManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  
  // Get the event status
  const status = event.status || getEventStatus(event);
  
  // Check if current user is registered (for demo, always using 'current-user')
  const isRegistered = isUserRegistered(event);
  
  const handleRSVP = () => {
    // RSVP for the event
    onRSVP(event.id);
    
    // Show toast notification
    toast({
      title: "RSVP Confirmed",
      description: `You've successfully registered for "${event.title}"`,
    });
    
    // Add to notifications
    addNotification({
      type: 'event',
      title: 'Event Registration Confirmed',
      message: `You're registered for "${event.title}" on ${new Date(event.date).toLocaleDateString()}`,
      link: '/events',
    });
    
    // In a real app, we would also send an email confirmation here
    console.log(`Email confirmation would be sent for event: ${event.title}`);
  };

  return (
    <Card className="mb-4">
      <EventCardHeader 
        title={event.title}
        date={event.date}
        time={event.time}
        type={event.type}
        status={status}
        isRegistered={isRegistered}
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
        
        <EventCardActions 
          status={status}
          isRegistered={isRegistered}
          attendees={event.attendees}
          capacity={event.capacity}
          onRSVP={handleRSVP}
          onOpenAttendanceModal={() => setShowAttendanceModal(true)}
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
      </CardContent>
      
      {/* Attendance management dialog */}
      <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attendance Management - {event.title}</DialogTitle>
          </DialogHeader>
          <EventAttendanceManager eventId={event.id} eventTitle={event.title} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventCard;
