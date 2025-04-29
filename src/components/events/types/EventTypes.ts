
export interface Event {
  id: number | string;
  title: string;
  description: string;
  date: Date | string;
  location?: string;
  imageUrl?: string;
  attendees: number;
  capacity?: number;
  isPremium?: boolean;
  isRegistered?: boolean;
  registeredUsers?: string[];
  pointsValue?: number;
  organizer?: string;
  organizerAvatar?: string;
  eventType?: 'workshop' | 'webinar' | 'conference' | 'meetup' | 'other';
  status?: 'upcoming' | 'ongoing' | 'past' | 'canceled';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  meetingLink?: string;
  startTime?: string;
}
