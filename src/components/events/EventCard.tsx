
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Check, Clock, Users } from 'lucide-react';
import { EVENT_TYPES } from './types/EventTypes';
import { getEventStatus, isUserRegistered } from './utils/EventUtils';
import { useNotifications } from '@/context/NotificationsContext';
import EventAttendanceManager from './attendance/EventAttendanceManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    registeredUsers?: string[];
    status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended';
  };
  onRSVP: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP }) => {
  const eventType = EVENT_TYPES[event.type];
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
      message: `You're registered for "${event.title}" on ${format(event.date, 'MMMM d')}`,
      link: '/events',
    });
    
    // In a real app, we would also send an email confirmation here
    console.log(`Email confirmation would be sent for event: ${event.title}`);
  };
  
  // Generate Google Calendar link
  const generateGoogleCalLink = () => {
    const startDateTime = new Date(event.date);
    const [startHour, startMinute] = event.time.split(' - ')[0].split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2); // Assuming 2 hour events
    
    const startStr = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  };
  
  // Generate Outlook Calendar link
  const generateOutlookCalLink = () => {
    const startDateTime = new Date(event.date);
    const [startHour, startMinute] = event.time.split(' - ')[0].split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2); // Assuming 2 hour events
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
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
          <div className="flex flex-col gap-1 items-end">
            <Badge className={`flex items-center ${eventType.color}`}>
              {eventType.icon}
              {eventType.label}
            </Badge>
            
            {/* Status badges */}
            {status === 'happening_soon' && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Clock size={12} className="mr-1" />
                Happening soon
              </Badge>
            )}
            {status === 'ended' && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                Ended
              </Badge>
            )}
            {isRegistered && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <Check size={12} className="mr-1" />
                Registered
              </Badge>
            )}
          </div>
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
        
        {/* Post-event attendance management button (shown if event has ended) */}
        {status === 'ended' && (
          <Button 
            variant="outline" 
            onClick={() => setShowAttendanceModal(true)}
            className="w-full mb-2 bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
          >
            <Users size={16} className="mr-2" />
            Manage Event Attendance
          </Button>
        )}
        
        {/* RSVP Button */}
        {status !== 'ended' && !isRegistered && (
          <Button 
            onClick={handleRSVP} 
            className="w-full bg-nortech-purple hover:bg-nortech-purple/90 mb-2"
            disabled={event.attendees >= event.capacity}
          >
            {event.attendees >= event.capacity ? "Fully Booked" : "Register Now"}
          </Button>
        )}
        
        {/* Already registered message */}
        {isRegistered && (
          <div className="text-center mb-2 text-green-600 font-medium">
            You're registered for this event
          </div>
        )}
        
        {/* Calendar buttons */}
        {(isRegistered || status !== 'ended') && (
          <div className="flex space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(generateGoogleCalLink(), '_blank')}
            >
              <Calendar size={16} className="mr-2" />
              Add to Google Calendar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(generateOutlookCalLink(), '_blank')}
            >
              <Calendar size={16} className="mr-2" />
              Add to Outlook
            </Button>
          </div>
        )}
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
