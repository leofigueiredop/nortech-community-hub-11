
import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from './types/EventTypes';

interface CalendarViewProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onRSVP }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(new Date());

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  // Filter events for the current month
  const currentMonthEvents = events.filter(event => 
    event.date.getMonth() === month.getMonth() && 
    event.date.getFullYear() === month.getFullYear()
  );

  const handlePreviousMonth = () => {
    setMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60}>
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {format(month, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
              disabled={{ before: new Date() }}
              modifiers={{
                event: currentMonthEvents.map(event => new Date(event.date)),
              }}
              modifiersStyles={{
                event: { 
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'var(--nortech-purple, #8b5cf6)' 
                },
              }}
            />
          </CardContent>
        </Card>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={40}>
        <div className="pl-4">
          <h2 className="text-lg font-medium mb-4">
            {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
          </h2>
          
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map(event => (
              <EventCard key={event.id} event={event} onRSVP={onRSVP} />
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <p>No events scheduled for this date.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CalendarView;
