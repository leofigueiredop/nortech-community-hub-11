
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
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Link as LinkIcon, ExternalLink, Crown } from 'lucide-react';
import { Event, EVENT_TYPES } from './types/EventTypes';
import { format } from 'date-fns';
import EventCardActions from './card/EventCardActions';
import EventCalendarButtons from './card/EventCalendarButtons';

interface EventDetailModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRSVP: (eventId: string | number) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onRSVP
}) => {
  const eventType = EVENT_TYPES[event.type];
  const isOnlineEvent = event.location.toLowerCase().includes('online') || 
                        event.location.toLowerCase().includes('zoom') || 
                        event.location.toLowerCase().includes('meet') ||
                        event.location.toLowerCase().includes('teams');

  const handleRSVP = () => {
    onRSVP(event.id);
    // Don't close the modal, just update the RSVP status
  };

  const handleExternalLink = () => {
    if (event.url) {
      window.open(event.url, '_blank');
    }
  };

  const handlePremiumTicket = () => {
    window.open('https://example.com/buy-ticket', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-2xl">
              {event.title}
              {event.isPremium && (
                <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  <Crown size={12} className="mr-1" />
                  Premium
                </Badge>
              )}
            </DialogTitle>
            <Badge className={`${eventType?.color || 'bg-gray-100 text-gray-800'}`}>
              {eventType?.icon}
              {eventType?.label || event.type}
            </Badge>
          </div>
          <DialogDescription>
            {format(event.date, 'EEEE, MMMM d, yyyy')} • {event.time}
          </DialogDescription>
        </DialogHeader>

        {event.image && (
          <div className="w-full h-64 overflow-hidden rounded-md mb-4">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-medium mb-2">About this event</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {event.description}
            </p>
            
            <h3 className="font-medium mb-2">Hosted by</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {event.speaker}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Date and time</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                    <br />
                    {event.time}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.location}
                    {event.url && isOnlineEvent && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 dark:text-blue-400"
                        onClick={handleExternalLink}
                      >
                        Join link <ExternalLink size={12} className="ml-1" />
                      </Button>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Attendees</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.attendees} / {event.capacity} registered
                  </p>
                </div>
              </div>
              
              {event.pointsValue && (
                <div className="flex items-start">
                  <div className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="font-medium">Points reward</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn {event.pointsValue} points for attending
                    </p>
                  </div>
                </div>
              )}
              
              {event.isPremium && (
                <div className="flex items-start">
                  <Crown className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Premium Event</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is a premium event that requires ticket purchase
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <div className="w-full space-y-2">
            {event.isPremium ? (
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600"
                onClick={handlePremiumTicket}
              >
                <Crown size={16} className="mr-2" />
                Buy Premium Ticket
              </Button>
            ) : (
              <EventCardActions 
                status={event.status || 'upcoming'}
                isRegistered={event.isRegistered}
                attendees={event.attendees}
                capacity={event.capacity}
                onRSVP={() => handleRSVP()}
                onOpenAttendanceModal={() => {}}
                isPremium={event.isPremium}
              />
            )}
            
            {(event.isRegistered || !event.status || event.status !== 'ended') && (
              <EventCalendarButtons 
                title={event.title}
                date={event.date}
                time={event.time}
                description={event.description}
                location={event.location}
                isRegistered={event.isRegistered}
                status={event.status || 'upcoming'}
              />
            )}
            
            {event.url && !isOnlineEvent && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExternalLink}
              >
                <LinkIcon size={16} className="mr-2" />
                {event.url.includes('zoom') || event.url.includes('meet') || event.url.includes('teams') 
                  ? 'Join Meeting' 
                  : 'Visit Event Page'
                }
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
