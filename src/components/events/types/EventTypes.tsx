
import { ReactNode } from 'react';

export type EventType = 'workshop' | 'webinar' | 'meetup' | 'conference' | 'course' | 'other';

export interface Event {
  id: number;
  community_id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url?: string;
  event_type: EventType;
  capacity?: number;
  is_virtual: boolean;
  meeting_link?: string;
  organizer_id?: string;
  is_featured: boolean;
  points_awarded: number;
  created_at: string;
  space_id?: string;
  attendees: number;
  isRegistered?: boolean;
  registeredUsers?: string[];
  isPremium?: boolean;
  price?: number;
  ticketUrl?: string;
}

export interface EventAttendee {
  id: number;
  event_id: number;
  user_id: string;
  registered_at: string;
  attended: boolean;
  feedback?: string;
  profile?: {
    id: string;
    name: string;
    avatar_url?: string;
    email?: string;
  };
}

export const EVENT_TYPES: Record<EventType, { label: string; icon: ReactNode; color: string; }> = {
  workshop: { 
    label: 'Workshop', 
    icon: <span>🛠️</span>, 
    color: 'bg-blue-100 text-blue-800' 
  },
  webinar: { 
    label: 'Webinar', 
    icon: <span>🎥</span>, 
    color: 'bg-purple-100 text-purple-800' 
  },
  meetup: { 
    label: 'Meetup', 
    icon: <span>👋</span>, 
    color: 'bg-green-100 text-green-800' 
  },
  conference: { 
    label: 'Conference', 
    icon: <span>🎪</span>, 
    color: 'bg-orange-100 text-orange-800' 
  },
  course: { 
    label: 'Course', 
    icon: <span>📚</span>, 
    color: 'bg-red-100 text-red-800' 
  },
  other: { 
    label: 'Other', 
    icon: <span>📆</span>, 
    color: 'bg-gray-100 text-gray-800' 
  },
};
