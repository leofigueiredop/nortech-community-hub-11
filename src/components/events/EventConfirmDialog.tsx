
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, Crown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from './types/EventTypes';

interface EventConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: Event | null;
}

const EventConfirmDialog: React.FC<EventConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  event
}) => {
  if (!event) return null;
  
  const isOnlineEvent = event.location.toLowerCase().includes('online') || 
                        event.location.toLowerCase().includes('zoom') || 
                        event.location.toLowerCase().includes('meet') ||
                        event.location.toLowerCase().includes('teams');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Registration</DialogTitle>
          <DialogDescription>
            You're about to register for this event
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Date</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Time</p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Location</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
            
            {event.isPremium && (
              <div className="flex items-start">
                <Crown className="w-5 h-5 mr-3 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Premium Event</p>
                  <p className="text-sm text-gray-600">This is a premium event</p>
                </div>
              </div>
            )}
            
            {event.url && (
              <div className="flex items-start">
                <ExternalLink className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Event Link</p>
                  <p className="text-sm text-blue-600 truncate">
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      {event.url}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-nortech-purple hover:bg-nortech-purple/90"
          >
            Confirm Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventConfirmDialog;
