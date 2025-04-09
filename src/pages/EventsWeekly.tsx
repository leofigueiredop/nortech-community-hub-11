
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EVENTS } from '@/components/events/EventTypes';
import WeeklyCalendarView from '@/components/events/WeeklyCalendarView';

const EventsWeekly = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState(EVENTS);
  const { toast } = useToast();

  // RSVP handler
  const handleRSVP = (eventId: number) => {
    toast({
      title: "RSVP Confirmed",
      description: `You've successfully registered for this event!`,
    });
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  return (
    <MainLayout title="Weekly Events">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekly Calendar</h1>
          <div className="flex items-center gap-3">
            <div className="border rounded-lg flex overflow-hidden">
              <Link to="/events">
                <Button variant="ghost" size="sm" className="rounded-none">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>Monthly</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="rounded-none bg-muted">
                <Clock size={16} className="mr-2" />
                <span>Weekly</span>
              </Button>
            </div>
          </div>
        </div>

        <WeeklyCalendarView 
          events={events}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          onRSVP={handleRSVP}
        />
      </div>
    </MainLayout>
  );
};

export default EventsWeekly;
