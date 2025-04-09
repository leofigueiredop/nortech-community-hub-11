
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EventsHeader from '@/components/events/EventsHeader';
import EventGrid from '@/components/events/EventGrid';
import { useToast } from '@/components/ui/use-toast';
import { EventType, Event } from '@/components/events/types/EventTypes';
import { EVENT_TYPES } from '@/components/events/types/EventTypes';
import { mockEvents } from '@/components/events/data/EventsMockData';
import { addPointsForEventAttendance } from '@/utils/pointsTracking';
import { usePoints } from '@/context/PointsContext';

type ViewType = 'calendar' | 'list' | 'grid';

const Events: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const { toast } = useToast();
  const { addPoints, awardBadge } = usePoints();
  
  // Filter events based on type
  const filteredEvents = filterType === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.type === filterType);

  const handleRSVP = (eventId: number) => {
    // Find the event
    const event = mockEvents.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Show toast
    toast({
      title: "RSVP Successful!",
      description: `You've registered for ${event.title}`,
      variant: "default"
    });
    
    // Add points if the event has points value
    if (event.pointsValue && event.pointsValue > 0) {
      addPoints({
        type: 'event_participation',
        description: `Registered for ${event.title}`,
        points: event.pointsValue
      });
      
      // Show toast for points
      toast({
        title: "Points Earned!",
        description: `You earned ${event.pointsValue} points for registering`,
        variant: "default",
      });
      
      // Track the event attendance with points
      addPointsForEventAttendance(eventId, event.pointsValue, event.badgeName);
    }
  };

  const handleOpenAttendanceModal = (eventId: number) => {
    // Implementation for opening attendance modal
    console.log('Opening attendance modal for event', eventId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <EventsHeader 
          viewType={viewType} 
          setViewType={(view: 'grid' | 'list') => setViewType(view)}
          filterType={filterType}
          setFilterType={setFilterType}
        />
        
        <EventGrid 
          events={filteredEvents} 
          viewType={viewType}
          onRSVP={handleRSVP}
          onOpenAttendanceModal={handleOpenAttendanceModal}
        />
      </div>
    </MainLayout>
  );
};

export default Events;
