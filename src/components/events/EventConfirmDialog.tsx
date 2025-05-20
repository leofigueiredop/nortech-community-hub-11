import React from 'react';
import { Event } from '@/components/events/types/EventTypes';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  event: Event | null;
}

const EventConfirmDialog: React.FC<EventConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  event
}) => {
  if (!event) return null;
  
  // Format the event date
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  
  // Calculate remaining spots
  const capacity = typeof event.capacity === 'string' ? parseInt(event.capacity) : (event.capacity || 0);
  const attendees = typeof event.attendees === 'string' ? parseInt(event.attendees) : (event.attendees || 0);
  const remainingSpots = capacity - attendees;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Registration</DialogTitle>
          <DialogDescription>
            You are registering for the following event:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-4">{event.title}</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time || '(Time not specified)'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location || (event.is_virtual ? 'Online Event' : 'Location TBD')}</span>
            </div>
            
            {capacity > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{remainingSpots} {remainingSpots === 1 ? 'spot' : 'spots'} remaining</span>
              </div>
            )}
          </div>
          
          {event.isPremium && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700">
                This is a premium event. Your membership includes access to this event.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirm Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventConfirmDialog;
