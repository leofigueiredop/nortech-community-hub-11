
export interface Event {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  content?: string;
  start_date: string;
  end_date: string;
  timezone?: string;
  location_type: 'online' | 'in_person' | 'hybrid';
  location_url?: string;
  location_address?: string;
  location_details?: string;
  max_attendees?: number;
  access_level: 'free' | 'premium' | 'premium_plus';
  is_featured: boolean;
  speaker_id?: string;
  speaker_name?: string;
  speaker_bio?: string;
  speaker_avatar?: string;
  banner_url?: string;
  points_value?: number;
  created_at: string;
  updated_at: string;
  event_type: string;
  is_virtual: boolean;
  points_awarded: number;
  
  // Campos adicionais necessários para compatibilidade com componentes existentes
  date?: Date;  // Adicionado para compatibilidade
  image?: string;
  url?: string;
  time?: string;
  type?: string;
  location?: string;
  speaker?: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  status?: 'upcoming' | 'live' | 'past' | 'cancelled';
  attendees?: number;
  capacity?: number;
  isRegistered?: boolean;
  isPremium?: boolean;
  pointsValue?: number;
  registeredUsers?: string[];
  platform?: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled' | 'no_show';
  notes?: string;
  registration_date: string;
  checkin_date?: string;
  created_at: string;
  updated_at: string;
  registered_at?: string; // Adicionado para compatibilidade
  attended?: boolean; // Adicionado para compatibilidade
  profile?: {
    id: string;
    name: string;
    avatar_url?: string;
    email?: string;
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
