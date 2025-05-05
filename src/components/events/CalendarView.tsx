import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from './types/EventTypes';
import { EVENT_TYPES } from './types/EventTypes';
import { format, isSameDay } from 'date-fns';

interface CalendarViewProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
  onDateSelect: (date: Date | undefined) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onRSVP, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Function to count events on a specific date
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };
  
  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <Card>
      <CardContent className="p-3">
        <CalendarComponent 
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            eventDay: (date) => getEventsForDay(date).length > 0
          }}
          modifiersClassNames={{
            eventDay: "bg-primary/10 border-primary/50"
          }}
          components={{
            DayContent: (props) => {
              const eventsForDay = getEventsForDay(props.date);
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {props.date.getDate()}
                  {eventsForDay.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5 justify-center">
                      {eventsForDay.length > 3 ? (
                        <Badge className="h-1.5 w-1.5 bg-primary p-0 rounded-full" />
                      ) : (
                        eventsForDay.slice(0, 3).map((_, i) => (
                          <Badge key={i} className="h-1.5 w-1.5 bg-primary p-0 rounded-full" />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarView;
