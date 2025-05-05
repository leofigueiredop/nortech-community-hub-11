import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface EventPreview {
  id: string;
  title: string;
  date: string;
  type: string;
}

const MiniCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  
  // Mock upcoming events
  const upcomingEvents: EventPreview[] = [
    {
      id: 'e1',
      title: 'Weekly Community Call',
      date: 'Tomorrow, 3:00 PM',
      type: 'live'
    },
    {
      id: 'e2',
      title: 'Product Demo',
      date: 'Friday, 1:00 PM',
      type: 'live'
    },
    {
      id: 'e3',
      title: 'Content Planning Session',
      date: 'Next Monday, 10:00 AM',
      type: 'meeting'
    }
  ];
  
  // Generate calendar days (simplified example)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date().getDate();
    
    for (let i = 1; i <= 31; i++) {
      days.push({
        date: i,
        isToday: i === today,
        hasEvent: [4, 12, 18, 22, 27].includes(i)
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
          {t('common:calendar.upcomingEvents')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, i) => (
            <div key={i} className="p-1 text-muted-foreground font-medium">
              {t(`common:calendar.weekdays.${day}`)}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <div 
              key={i}
              className={`
                p-1.5 rounded-full flex items-center justify-center
                ${day.isToday ? 'bg-nortech-purple text-white' : 'hover:bg-muted cursor-pointer'}
                ${day.hasEvent && !day.isToday ? 'border-b-2 border-nortech-purple' : ''}
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
        
        {/* Upcoming events list */}
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer gap-3"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="h-2 w-2 rounded-full bg-nortech-purple"></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{event.title}</h4>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
              {event.type === 'live' && (
                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                  {t('common:calendar.live')}
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
          {t('common:calendar.viewAllEvents')}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniCalendar;
