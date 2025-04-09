
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface EventCalendarButtonsProps {
  title: string;
  date: Date;
  time: string;
  description: string;
  location: string;
  isRegistered: boolean;
  status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended';
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
  // Generate Google Calendar link
  const generateGoogleCalLink = () => {
    const startDateTime = new Date(date);
    const [startHour, startMinute] = time.split(' - ')[0].split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2); // Assuming 2 hour events
    
    const startStr = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  };
  
  // Generate Outlook Calendar link
  const generateOutlookCalLink = () => {
    const startDateTime = new Date(date);
    const [startHour, startMinute] = time.split(' - ')[0].split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2); // Assuming 2 hour events
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  };

  if (!(isRegistered || status !== 'ended')) {
    return null;
  }
  
  return (
    <div className="flex space-x-2 mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={() => window.open(generateGoogleCalLink(), '_blank')}
      >
        <Calendar size={16} className="mr-2" />
        Add to Google Calendar
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={() => window.open(generateOutlookCalLink(), '_blank')}
      >
        <Calendar size={16} className="mr-2" />
        Add to Outlook
      </Button>
    </div>
  );
};

export default EventCalendarButtons;
