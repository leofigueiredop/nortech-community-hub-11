import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ChevronRight, Calendar } from 'lucide-react';
import { EVENT_TYPES, Event } from './EventTypes';
import { useTranslation } from 'react-i18next';

interface HomeFeedCalendarProps {
  events: Event[];
  maxEvents?: number;
}

const HomeFeedCalendar: React.FC<HomeFeedCalendarProps> = ({ 
  events,
  maxEvents = 3 
}) => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const { t } = useTranslation();
  
  // Filter upcoming events for next 7 days
  const upcomingEvents = events
    .filter(event => isAfter(new Date(event.date), today) && isBefore(new Date(event.date), nextWeek))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, maxEvents);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{/* @ts-expect-error i18next typing */}{t('calendar.upcomingEvents')}</CardTitle>
          <Link to="/events">
            <Button variant="ghost" size="sm" className="text-nortech-purple">
              {/* @ts-expect-error i18next typing */}
              {t('calendar.viewAll')}
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map(event => {
              const eventType = EVENT_TYPES[event.type];
              return (
                <div key={event.id} className="flex items-start p-2 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                      <span className="text-xs font-medium">{format(new Date(event.date), 'MMM')}</span>
                      <span className="text-lg font-bold">{format(new Date(event.date), 'd')}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <Badge className={`ml-2 flex items-center ${eventType.color}`}>
                        {eventType.icon}
                        {/* @ts-expect-error i18next typing */}
                        {t(`eventType.${event.type}`)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.time} • {event.speaker}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>{/* @ts-expect-error i18next typing */}{t('calendar.noUpcomingEvents')}</p>
            <Link to="/events">
              <Button variant="link" className="mt-2 text-nortech-purple">
                {/* @ts-expect-error i18next typing */}
                {t('calendar.viewAllEvents')}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeFeedCalendar;
