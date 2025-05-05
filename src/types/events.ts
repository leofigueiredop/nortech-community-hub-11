type UUID = string; // Type alias for UUID strings

// Base Event interface matching Supabase schema
export interface Event {
  id: number; // serial4 in Postgres
  title: string;
  description?: string;
  date: Date;
  location?: string;
  image_url?: string;
  event_type: string;
  capacity?: number;
  is_virtual: boolean;
  meeting_link?: string;
  organizer_id?: UUID;
  is_featured: boolean;
  points_awarded: number;
  created_at: string;
  updated_at: string;
  community_id: UUID;
  space_id?: UUID;
}

// UI-specific event interface extending base Event
export interface EventWithUI extends Event {
  status?: 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';
  isRegistered?: boolean;
  isPremium?: boolean;
  attendees?: number;
  speaker?: {
    id: UUID;
    name: string;
    avatar?: string;
    bio?: string;
  };
}

// Event Attendee interface matching Supabase schema
export interface EventAttendee {
  id: number; // serial4 in Postgres
  event_id: number;
  user_id: UUID;
  registered_at: string;
  attended: boolean;
  feedback?: string;
}

// Event Series interface matching Supabase schema
export interface EventSeries {
  id: UUID;
  community_id: UUID;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
