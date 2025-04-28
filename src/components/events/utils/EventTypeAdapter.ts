
// Fix for the comparison errors in lines 101-102
// We need to properly handle status type checking

import { Event } from '../types/EventTypes';

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

// Add the adaptEventForComponent function
export const adaptEventForComponent = (event: any): Event => {
  // Create a properly formatted Event object from any event-like data
  return {
    id: event.id || `event-${Date.now()}`,
    community_id: event.community_id || 'default',
    title: event.title || '',
    description: event.description || '',
    date: event.date instanceof Date ? event.date : new Date(event.date || event.start_date || Date.now()),
    location: event.location || 'Online',
    image_url: event.image_url || event.image || '/placeholder.svg',
    event_type: event.event_type || event.type || 'other',
    capacity: event.capacity ? Number(event.capacity) : undefined,
    is_virtual: event.is_virtual || event.location_type === 'online' || false,
    meeting_link: event.meeting_link || event.url || undefined,
    organizer_id: event.organizer_id || undefined,
    is_featured: event.is_featured || false,
    points_awarded: event.points_awarded || event.pointsValue || 0,
    attendees: typeof event.attendees === 'string' ? parseInt(event.attendees) : (event.attendees || 0),
    isRegistered: event.isRegistered || false,
    registeredUsers: event.registeredUsers || [],
    isPremium: event.isPremium || event.access_level === 'premium' || event.access_level === 'premium_plus' || false,
    
    // Additional component properties
    image: event.image || event.image_url || '/placeholder.svg',
    type: event.type || event.event_type || 'other',
    time: event.time || '',
    speaker: event.speaker || '',
    status: event.status || getEventStatus(event.status || ''),
  };
};
