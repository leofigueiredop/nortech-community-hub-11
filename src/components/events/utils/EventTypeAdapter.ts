
import { Event as EventType } from '@/types/events';
import { Event as ComponentEvent, EventType as ComponentEventType } from '@/components/events/types/EventTypes';

/**
 * Adapts the database event type to the component event type
 * This helps bridge the gap between the different event types used in the app
 */
export function adaptEventForComponent(event: EventType): ComponentEvent {
  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    date: event.date || new Date(event.start_date),
    location: event.location || event.location_address || (event.is_virtual ? 'Online' : ''),
    image_url: event.banner_url || event.image,
    event_type: event.event_type,
    capacity: event.max_attendees,
    is_virtual: event.is_virtual,
    meeting_link: event.location_url,
    is_featured: event.is_featured,
    points_awarded: event.points_awarded,
    created_at: event.created_at,
    community_id: event.community_id,
    space_id: undefined,
    attendees: event.attendees || 0,
    
    // Additional properties needed for components
    image: event.banner_url || event.image,
    type: mapEventType(event.event_type),
    time: event.time || `${new Date(event.start_date).getHours()}:00 - ${new Date(event.end_date).getHours()}:00`,
    speaker: event.speaker_name || (typeof event.speaker === 'object' ? event.speaker.name : event.speaker),
    url: event.location_url,
    isRegistered: event.isRegistered || false,
    isPremium: event.isPremium || event.access_level === 'premium' || event.access_level === 'premium_plus',
    platform: getPlatformFromUrl(event.location_url || event.url || ''),
    status: getEventStatus(event),
    pointsValue: event.points_awarded || event.points_value || event.pointsValue,
    registeredUsers: event.registeredUsers || [],
    price: undefined,
    ticketUrl: undefined,
    organizer_id: undefined,
    
    // Required fields from event type
    start_date: event.start_date,
    end_date: event.end_date,
    location_type: event.location_type || 'online',
    access_level: event.access_level || 'free',
    updated_at: event.updated_at
  };
}

// Helper function to map event_type to ComponentEventType
function mapEventType(eventType: string | undefined): ComponentEventType {
  if (!eventType) return 'workshop';

  // Map common event types
  switch (eventType.toLowerCase()) {
    case 'workshop':
      return 'workshop';
    case 'webinar':
      return 'webinar';
    case 'meetup':
      return 'meetup';
    case 'conference':
      return 'conference';
    case 'course':
      return 'course';
    case 'live':
    case 'livestream':
      return 'live' as ComponentEventType; // Type assertion to ComponentEventType
    case 'mentoria':
    case 'mentorship':
      return 'mentoria' as ComponentEventType; // Type assertion to ComponentEventType
    default:
      return 'other';
  }
}

// Determine platform from URL
function getPlatformFromUrl(url: string): string | undefined {
  if (!url) return undefined;
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('zoom')) return 'zoom';
  if (urlLower.includes('meet.google')) return 'meet';
  if (urlLower.includes('teams.microsoft')) return 'teams';
  
  return undefined;
}

// Get event status based on date/time
function getEventStatus(event: EventType): 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress' {
  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  // Convert old status names to new ones
  if (event.status === 'past' || event.status === 'ended') return 'ended';
  if (event.status === 'cancelled') return 'ended';
  if (typeof event.status === 'string' && 
      ['upcoming', 'live', 'happening_soon', 'in_progress', 'ended'].includes(event.status)) {
    return event.status as 'upcoming' | 'live' | 'happening_soon' | 'in_progress' | 'ended';
  }
  
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'live';
  if (now > endDate) return 'ended';
  
  return 'upcoming';
}
