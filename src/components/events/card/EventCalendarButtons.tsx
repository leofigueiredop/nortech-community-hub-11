
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EventCalendarButtonsProps {
  title: string;
  date: Date;
  time: string;
  description: string;
  location: string;
  isRegistered?: boolean;
  status?: 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';
}

const EventCalendarButtons: React.FC<EventCalendarButtonsProps> = ({
  title,
  date,
  time,
  description,
  location,
  isRegistered,
  status
}) => {
  // Format the date and time for calendar integration
  const formatGoogleCalendarDate = (date: Date, timeStr: string) => {
    const [startTime] = timeStr.split(' - ');
    const [hours, minutes] = startTime.split(':');
    
    const eventDate = new Date(date);
    eventDate.setHours(parseInt(hours));
    eventDate.setMinutes(parseInt(minutes));
    
    // Add 1 hour as default duration
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    return {
      start: formatDateForGoogle(eventDate),
      end: formatDateForGoogle(endDate)
    };
  };
  
  // Only show calendar buttons for upcoming events or for registered users
  if (status === 'ended' && !isRegistered) {
    return null;
  }
  
  const { start, end } = formatGoogleCalendarDate(date, time);
  
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
  
  // Function to generate iCal file
  const generateICalFile = () => {
    const formatICalDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    };
    
    const [startTime] = time.split(' - ');
    const [hours, minutes] = startTime.split(':');
    
    const eventDate = new Date(date);
    eventDate.setHours(parseInt(hours));
    eventDate.setMinutes(parseInt(minutes));
    
    // Add 1 hour as default duration
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const icalStart = formatICalDate(eventDate);
    const icalEnd = formatICalDate(endDate);
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//hacksw/handcal//NONSGML v1.0//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART:${icalStart}`,
      `DTEND:${icalEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `${title.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex justify-end mt-2" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Add to Calendar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(googleCalendarUrl, '_blank')}>
            Google Calendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={generateICalFile}>
            Apple / Outlook Calendar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EventCalendarButtons;
