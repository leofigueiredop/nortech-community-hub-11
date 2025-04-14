
import React from 'react';
import { format } from 'date-fns';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EVENT_TYPES, EventType } from '../types/EventTypes';
import { Crown } from 'lucide-react';

interface EventCardHeaderProps {
  title: string;
  date: Date;
  time: string;
  type: EventType;
  status?: 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';
  isRegistered?: boolean;
  isPremium?: boolean;
}

const EventCardHeader: React.FC<EventCardHeaderProps> = ({
  title,
  date,
  time,
  type,
  status = 'upcoming',
  isRegistered = false,
  isPremium = false
}) => {
  const eventType = EVENT_TYPES[type];
  
  // Get status badge color
  const getStatusBadge = () => {
    switch(status) {
      case 'live':
      case 'in_progress': 
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ended': 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'happening_soon':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  // Get status display text
  const getStatusText = () => {
    switch(status) {
      case 'live':
      case 'in_progress': 
        return 'Live now';
      case 'ended': 
        return 'Ended';
      case 'happening_soon':
        return 'Starting soon';
      default: 
        return 'Upcoming';
    }
  };

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg group-hover:text-nortech-purple transition-colors">
            {title}
            {isPremium && (
              <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                <Crown size={12} className="mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(date, 'MMMM d, yyyy')} • {time}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <Badge className={`flex items-center ${eventType?.color || 'bg-gray-100 text-gray-800'}`}>
            {eventType?.icon}
            {eventType?.label || type}
          </Badge>
          
          {isRegistered && (
            <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
              Registered
            </Badge>
          )}
          
          {!isRegistered && (
            <Badge variant="outline" className={getStatusBadge()}>
              {getStatusText()}
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default EventCardHeader;
