// Fix for the comparison errors in lines 101-102
// We need to properly handle status type checking and add the missing adaptEventForComponent function

import { Event } from '../types/EventTypes';
import { Event as SupabaseEvent } from '@/types/events';
import { Event as ComponentEvent, EventType } from '@/components/events/types/EventTypes';
import { format } from 'date-fns';

// Define a type for the status
type EventStatus = 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';

export const getEventStatus = (status: string): "live" | "upcoming" | "ended" | "happening_soon" | "in_progress" => {
  // Convert status strings to allowed types using type assertion to prevent comparison errors
  if (status === "past") return "ended";
  if (status === "cancelled") return "ended";
  
  // Default fallback for invalid statuses
  if (!(["live", "upcoming", "ended", "happening_soon", "in_progress"] as string[]).includes(status)) {
    return "upcoming";
  }
  
  return status as "live" | "upcoming" | "ended" | "happening_soon" | "in_progress";
};

/**
 * Adapts a Supabase event to the format expected by UI components
 */
export const adaptEventForComponent = (event: SupabaseEvent): ComponentEvent => {
  // Format time string from date
  const formatTimeString = (date: Date): string => {
    if (!date) return '';
    return format(date, 'h:mm a');
  };

  // Determine event type from event_type
  const determineEventType = (eventType: string): EventType => {
    if (!eventType) return 'other';
    
    const typeMap: Record<string, EventType> = {
      'workshop': 'workshop',
      'webinar': 'webinar',
      'meetup': 'meetup',
      'conference': 'conference',
      'course': 'course',
      'live': 'live',
      'mentoria': 'mentoria',
      'other': 'other'
    };
    
    return typeMap[eventType.toLowerCase()] || 'other';
  };
  
  // Determine event status
  const determineEventStatus = (): EventStatus => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    // Add 2 hours to the event start time for a default duration
    const eventEndTime = new Date(eventDate);
    eventEndTime.setHours(eventEndTime.getHours() + 2);
    
    // Event happening within the next hour
    const oneHourFromNow = new Date(now);
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    
    if (now < eventDate && eventDate <= oneHourFromNow) {
      return 'happening_soon';
    } else if (eventDate <= now && now <= eventEndTime) {
      return 'in_progress';
    } else if (now < eventDate) {
      return 'upcoming';
    } else {
      return 'ended';
    }
  };

  // Convert event date to appropriate format
  const date = event.date instanceof Date 
    ? event.date 
    : new Date(event.date);

  // Create the adapted event object
  return {
    id: String(event.id), // Convert to string to match ComponentEvent type
    community_id: event.community_id,
    title: event.title,
    description: event.description || '',
    date: date,
    location: event.location || '',
    image_url: event.image_url,
    event_type: event.event_type,
    capacity: event.capacity || 0,
    is_virtual: event.is_virtual,
    meeting_link: event.meeting_link,
    organizer_id: event.organizer_id,
    is_featured: event.is_featured,
    points_awarded: event.points_awarded,
    created_at: event.created_at,
    space_id: event.space_id,
    
    // UI-specific properties
    attendees: 0, // Default value, should be updated later if available
    isRegistered: false, // Default value, should be updated later
    image: event.image_url || '',
    type: determineEventType(event.event_type || ''),
    time: formatTimeString(date),
    status: determineEventStatus(),
    isPremium: false, // Default value, should be updated based on access_level if available
    registeredUsers: [] // Add this to match ComponentEvent type
  };
};

/**
 * Adapts a component event back to the format expected by Supabase
 */
export const adaptComponentEventForSupabase = (event: ComponentEvent): Partial<SupabaseEvent> => {
  return {
    id: typeof event.id === 'string' ? parseInt(event.id) : event.id,
    community_id: event.community_id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    image_url: event.image_url || event.image,
    event_type: event.event_type || event.type,
    capacity: event.capacity,
    is_virtual: event.is_virtual,
    meeting_link: event.meeting_link,
    organizer_id: event.organizer_id,
    is_featured: event.is_featured,
    points_awarded: event.points_awarded,
    created_at: event.created_at,
    space_id: event.space_id
  };
};
