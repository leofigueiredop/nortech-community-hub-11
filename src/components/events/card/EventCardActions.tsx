
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Users, ExternalLink, Crown } from 'lucide-react';

interface EventCardActionsProps {
  status?: 'upcoming' | 'live' | 'ended';
  isRegistered?: boolean;
  attendees: number;
  capacity: number;
  onRSVP: () => void;
  onOpenAttendanceModal: () => void;
  isPremium?: boolean;
}

const EventCardActions: React.FC<EventCardActionsProps> = ({
  status = 'upcoming',
  isRegistered = false,
  attendees,
  capacity,
  onRSVP,
  onOpenAttendanceModal,
  isPremium = false
}) => {
  // Event has ended
  if (status === 'ended') {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          onClick={(e) => {
            e.stopPropagation();
            onOpenAttendanceModal();
          }}
        >
          <Users size={16} className="mr-2" />
          View Attendees
        </Button>
      </div>
    );
  }

  // User is already registered
  if (isRegistered) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
          disabled
        >
          <Check size={16} className="mr-2" />
          Registered
        </Button>
      </div>
    );
  }

  // Event is full
  if (attendees >= capacity) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          disabled
        >
          Fully Booked
        </Button>
      </div>
    );
  }

  // Premium event - with external link
  if (isPremium) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open('https://example.com/buy-ticket', '_blank');
          }}
        >
          <Crown size={16} className="mr-2" />
          Buy Premium Ticket
        </Button>
      </div>
    );
  }

  // Default - RSVP button
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        className="w-full sm:w-auto bg-nortech-purple hover:bg-nortech-purple/90"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRSVP();
        }}
      >
        RSVP Now
      </Button>
    </div>
  );
};

export default EventCardActions;
