
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EventCardActionsProps {
  status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended';
  isRegistered: boolean;
  attendees: number;
  capacity: number;
  onRSVP: () => void;
  onOpenAttendanceModal: () => void;
}

const EventCardActions: React.FC<EventCardActionsProps> = ({
  status,
  isRegistered,
  attendees,
  capacity,
  onRSVP,
  onOpenAttendanceModal
}) => {
  return (
    <>
      {/* Post-event attendance management button (shown if event has ended) */}
      {status === 'ended' && (
        <Button 
          variant="outline" 
          onClick={onOpenAttendanceModal}
          className="w-full mb-2 bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
        >
          <Users size={16} className="mr-2" />
          Manage Event Attendance
        </Button>
      )}
      
      {/* RSVP Button */}
      {status !== 'ended' && !isRegistered && (
        <Button 
          onClick={onRSVP} 
          className="w-full bg-nortech-purple hover:bg-nortech-purple/90 mb-2"
          disabled={attendees >= capacity}
        >
          {attendees >= capacity ? "Fully Booked" : "Register Now"}
        </Button>
      )}
      
      {/* Already registered message */}
      {isRegistered && (
        <div className="text-center mb-2 text-green-600 font-medium">
          You're registered for this event
        </div>
      )}
    </>
  );
};

export default EventCardActions;
