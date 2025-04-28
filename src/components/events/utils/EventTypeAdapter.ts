
import { Event as EventType } from '@/types/events';
import { Event as ComponentEvent, EventType as ComponentEventType } from '@/components/events/types/EventTypes';

/**
 * Adapts the database event type to the component event type
 * This helps bridge the gap between the different event types used in the app
 */
export function adaptEventForComponent(event: EventType): ComponentEvent {
  return {
    id: typeof event.id === 'string' ? parseInt(event.id) : event.id as number,
    title: event.title,
    description: event.description || '',
    date: event.date || new Date(event.start_date),
    time: event.time || `${new Date(event.start_date).getHours()}:00 - ${new Date(event.end_date).getHours()}:00`,
    type: mapEventType(event.event_type),
    event_type: mapEventType(event.event_type),
    location: event.location || event.location_address || (event.is_virtual ? 'Online' : ''),
    speaker: event.speaker_name || (event.speaker ? event.speaker.name : ''),
    image: event.banner_url || event.image,
    attendees: event.attendees || 0,
    capacity: event.max_attendees || 100,
    community_id: event.community_id,
    is_virtual: event.is_virtual,
    is_featured: event.is_featured,
    points_awarded: event.points_awarded,
    created_at: event.created_at,
    isRegistered: event.isRegistered || false,
    isPremium: event.isPremium || event.access_level === 'premium' || event.access_level === 'premium_plus',
    url: event.location_url || event.url,
    platform: getPlatformFromUrl(event.location_url || event.url || ''),
    status: getEventStatus(event),
    pointsValue: event.points_awarded || event.points_value || event.pointsValue,
    registeredUsers: event.registeredUsers || []
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
      return 'live';
    case 'mentoria':
    case 'mentorship':
      return 'mentoria';
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
function getEventStatus(event: EventType): 'upcoming' | 'live' | 'past' | 'cancelled' {
  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  if (event.status) return event.status as 'upcoming' | 'live' | 'past' | 'cancelled';
  
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'live';
  if (now > endDate) return 'past';
  
  return 'upcoming';
}
