
import { Event } from '@/types/events';

// Helper functions for event status
export const getEventStatus = (event: Event): 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress' => {
  const now = new Date();
  const eventDate = new Date(event.date || event.start_date);
  
  if (!event.time) {
    // If no time is provided, just compare dates
    if (now.getDate() === eventDate.getDate() && 
        now.getMonth() === eventDate.getMonth() && 
        now.getFullYear() === eventDate.getFullYear()) {
      return 'in_progress';
    } else if (now > eventDate) {
      return 'ended';
    } else {
      return 'upcoming';
    }
  }
  
  const eventTime = (event.time || "").split(' - ')[0]; // Get start time
  const [hourStr, minuteStr] = (eventTime || "").split(':');
  
  if (!hourStr || !minuteStr) {
    // Fallback if time format is invalid
    return now > eventDate ? 'ended' : 'upcoming';
  }
  
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  // Set event start and end time
  const eventStart = new Date(eventDate);
  eventStart.setHours(hour);
  eventStart.setMinutes(minute);
  
  // Approximate event end time (2 hours after start)
  const eventEnd = new Date(eventStart);
  eventEnd.setHours(eventEnd.getHours() + 2);
  
  // Check if event is happening soon (within 24 hours)
  const oneDay = 24 * 60 * 60 * 1000;
  const timeDiff = eventStart.getTime() - now.getTime();
  
  if (now > eventEnd) {
    return 'ended';
  } else if (now >= eventStart && now <= eventEnd) {
    return 'in_progress';
  } else if (timeDiff > 0 && timeDiff <= oneDay) {
    return 'happening_soon';
  } else {
    return 'upcoming';
  }
};

// Check if user is registered for an event
export const isUserRegistered = (event: Event, userId: string = 'current-user'): boolean => {
  if (!event.registeredUsers) return event.isRegistered || false;
  return event.registeredUsers.includes(userId) || !!event.isRegistered;
};
