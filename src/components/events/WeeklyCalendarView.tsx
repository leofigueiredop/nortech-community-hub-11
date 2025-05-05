import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, eachDayOfInterval, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Event } from './types/EventTypes';
import WeeklyEventCard from './WeeklyEventCard';
import { useTranslation } from 'react-i18next';

interface WeeklyCalendarViewProps {
  events: Event[];
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  onRSVP: (eventId: number) => void;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ 
  events, 
  currentWeek, 
  setCurrentWeek, 
  onRSVP 
}) => {
  // Get the days of the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const { t } = useTranslation();

  // Handle navigation between weeks
  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft size={16} className="mr-1" />
              {/* @ts-expect-error i18next typing */}
              {t('calendar.previous')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              {/* @ts-expect-error i18next typing */}
              {t('calendar.today')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              {/* @ts-expect-error i18next typing */}
              {t('calendar.next')}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-7 gap-4">
          {/* Day headers */}
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`text-center p-2 font-medium ${
                isSameDay(day, new Date()) ? 'bg-purple-100 dark:bg-purple-900/30 rounded-md' : ''
              }`}
            >
              <div className="mb-1">{/* @ts-expect-error i18next typing */}{t(`calendar.weekdays.${format(day, 'EEEE').toLowerCase()}`)}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}
          
          {/* Week grid */}
          {daysOfWeek.map((day, index) => {
            const dayEvents = events.filter(event => 
              isSameDay(new Date(event.date), day)
            );
            
            return (
              <div key={`events-${index}`} className="min-h-[200px] border rounded-md p-2">
                {dayEvents.length > 0 ? (
                  <div>
                    {dayEvents.map(event => (
                      <WeeklyEventCard 
                        key={event.id} 
                        event={event} 
                        onRSVP={onRSVP} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    {/* @ts-expect-error i18next typing */}
                    {t('calendar.noEvents')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendarView;
