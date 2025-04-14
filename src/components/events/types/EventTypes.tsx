
import React from 'react';
import { 
  Users, Coffee, Presentation, VideoIcon, 
  Briefcase, GraduationCap, HeartHandshake, Trophy, 
  Calendar, Laptop, Headphones, Star
} from 'lucide-react';

export type EventType = 'workshop' | 'meetup' | 'conference' | 'webinar' | 'career_fair' | 'course' | 'volunteer' | 'competition' | 'live' | 'mentoria';

export interface Event {
  id: number;
  title: string;
  description: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  speaker: string;
  image: string | null;
  status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended';
  isRegistered: boolean;
  attendees: number;
  capacity: number;
  url?: string;
  platform?: 'zoom' | 'teams' | 'meet' | 'other';
  pointsValue?: number; // Points earned for attending
  badgeName?: string; // Badge earned for attending
  registeredUsers?: string[]; // Array of registered user IDs
}

export const EVENT_TYPES = {
  workshop: {
    label: 'Workshop',
    icon: <Briefcase size={14} className="mr-1" />,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  meetup: {
    label: 'Meetup',
    icon: <Coffee size={14} className="mr-1" />,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  conference: {
    label: 'Conference',
    icon: <Presentation size={14} className="mr-1" />,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  webinar: {
    label: 'Webinar',
    icon: <VideoIcon size={14} className="mr-1" />,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  career_fair: {
    label: 'Career Fair',
    icon: <Briefcase size={14} className="mr-1" />,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  course: {
    label: 'Course',
    icon: <GraduationCap size={14} className="mr-1" />,
    color: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  volunteer: {
    label: 'Volunteer',
    icon: <HeartHandshake size={14} className="mr-1" />,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  competition: {
    label: 'Competition',
    icon: <Trophy size={14} className="mr-1" />,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  live: {
    label: 'Live',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <Laptop size={14} className="mr-1" />
  },
  mentoria: {
    label: 'Mentoria',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <Headphones size={14} className="mr-1" />
  }
};

// Helper function for getting type filters
export const getTypeFilters = () => {
  return Object.entries(EVENT_TYPES).map(([type, details]) => ({
    type,
    details
  }));
};
