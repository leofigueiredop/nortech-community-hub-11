export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url?: string;
  event_type: string;
  capacity?: number;
  is_virtual: boolean;
  meeting_link?: string;
  organizer_id?: string;
  is_featured: boolean;
  points_awarded: number;
  space_id?: string;
  start_date?: string;
  end_date?: string;
  timezone?: string;
  location_type: 'online' | 'in_person' | 'hybrid';
  location_url?: string;
  location_address?: string;
  location_details?: string;
  max_attendees?: number;
  access_level: 'free' | 'premium' | 'premium_plus';
  speaker_id?: string;
  speaker_name?: string;
  speaker_bio?: string;
  speaker_avatar?: string;
  banner_url?: string;
  points_value?: number;
  created_at: string;
  updated_at: string;
  community_id: string;
  url?: string;
  time?: string;
  type?: string;
  speaker?: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  } | string;
  status?: 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';
  attendees?: number;
  isRegistered?: boolean;
  isPremium?: boolean;
  pointsValue?: number;
  registeredUsers?: string[];
  platform?: string;
}

export interface EventAttendee {
  id: number;
  event_id: number;
  user_id: string;
  registered_at: Date;
  attended: boolean;
  feedback?: string;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled' | 'no_show';
  notes?: string;
  registration_date?: Date;
  checkin_date?: Date;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface EventSeries {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
