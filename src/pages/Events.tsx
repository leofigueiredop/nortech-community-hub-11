
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { usePoints } from '@/context/PointsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export type EventType = 'workshop' | 'webinar' | 'meetup' | 'conference' | 'hackathon';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  pointsReward: number;
}

const EVENT_TYPES = ['workshop', 'webinar', 'meetup', 'conference', 'hackathon'];

const Events: React.FC = () => {
  const { awardPoints, awardBadge } = usePoints();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);

  // This is a stub component for now
  return (
    <MainLayout title="Events">
      <div className="container py-6">
        <h1 className="text-3xl font-bold">Community Events</h1>
        <p className="text-muted-foreground mt-2">
          Attend events to earn points and badges
        </p>

        {events.length === 0 ? (
          <div className="py-24 text-center">
            <p>No upcoming events at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 mt-6">
            {/* Event cards would go here */}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
