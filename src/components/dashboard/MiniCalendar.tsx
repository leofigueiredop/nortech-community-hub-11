import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventPreview {
  id: string;
  title: string;
  start_date: string; // ISO string
  type?: string;
}

interface MiniCalendarProps {
  events?: EventPreview[];
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [] }) => {
  const navigate = useNavigate();

  // Helper para saber se há evento em um dia
  const hasEventOnDay = (date: Date) =>
    events.some(
      (event) =>
        new Date(event.start_date).toDateString() === date.toDateString()
    );

  // Gera os dias do mês atual
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Preenche dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null });
    }

    // Preenche os dias do mês
    for (let i = 1; i <= lastDate; i++) {
      const dateObj = new Date(year, month, i);
      days.push({
        date: i,
        isToday: i === today.getDate(),
        hasEvent: hasEventOnDay(dateObj),
        dateObj,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-nortech-purple" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="p-1 text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) =>
            day.date ? (
              <div
                key={i}
                className={`
                  p-1.5 rounded-full flex items-center justify-center
                  ${day.isToday ? 'bg-nortech-purple text-white' : 'hover:bg-muted cursor-pointer'}
                  ${day.hasEvent && !day.isToday ? 'border-b-2 border-nortech-purple' : ''}
                `}
                title={
                  day.hasEvent
                    ? events
                        .filter(
                          (event) =>
                            new Date(event.start_date).toDateString() ===
                            day.dateObj.toDateString()
                        )
                        .map((event) => event.title)
                        .join(', ')
                    : undefined
                }
              >
                {day.date}
              </div>
            ) : (
              <div key={i}></div>
            )
          )}
        </div>

        {/* Upcoming events list */}
        <div className="space-y-2">
          {events.length === 0 && (
            <div className="text-xs text-muted-foreground">No upcoming events</div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer gap-3"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="h-2 w-2 rounded-full bg-nortech-purple"></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{event.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.start_date).toLocaleString()}
                </p>
              </div>
              {event.type === 'live' && (
                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                  Live
                </span>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full text-center justify-center text-nortech-purple"
          onClick={() => navigate('/events')}
        >
          View All Events
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniCalendar;