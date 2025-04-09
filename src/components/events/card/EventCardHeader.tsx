
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Check } from 'lucide-react';
import { EVENT_TYPES } from '../types/EventTypes';

interface EventCardHeaderProps {
  title: string;
  date: Date;
  time: string;
  type: keyof typeof EVENT_TYPES;
  status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended';
  isRegistered: boolean;
}

const EventCardHeader: React.FC<EventCardHeaderProps> = ({
  title,
  date,
  time,
  type,
  status,
  isRegistered
}) => {
  const eventType = EVENT_TYPES[type];
  
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">
            {format(date, 'MMMM d, yyyy')} • {time}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Badge className={`flex items-center ${eventType.color}`}>
            {eventType.icon}
            {eventType.label}
          </Badge>
          
          {/* Status badges */}
          {status === 'happening_soon' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock size={12} className="mr-1" />
              Happening soon
            </Badge>
          )}
          {status === 'ended' && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
              Ended
            </Badge>
          )}
          {isRegistered && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Check size={12} className="mr-1" />
              Registered
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default EventCardHeader;
