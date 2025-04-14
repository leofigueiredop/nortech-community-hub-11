
import React from 'react';
import { Video, Coffee, GraduationCap, Mic, Users, Music, BookOpen, Heart, Medal, Briefcase, HandHelping, Laptop, Headphones } from 'lucide-react';

export type EventType = 'webinar' | 'meetup' | 'conference' | 'workshop' | 'course' | 'hackathon' | 'talk' | 'party' | 'competition' | 'career_fair' | 'volunteer' | 'live' | 'mentoria';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: EventType;
  speaker: string;
  location: string;
  attendees: number;
  capacity: number;
  image?: string;
  url?: string;
  platform?: 'zoom' | 'meet' | 'teams' | string;
  isRegistered?: boolean;
  status?: 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress';
  registeredUsers?: string[];
  pointsValue?: number;
  isPremium?: boolean;
}

export const EVENT_TYPES = {
  webinar: {
    label: 'Webinar',
    icon: <Video className="h-3 w-3 mr-1" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  meetup: {
    label: 'Meetup',
    icon: <Coffee className="h-3 w-3 mr-1" />,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  },
  conference: {
    label: 'Conference',
    icon: <Users className="h-3 w-3 mr-1" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  },
  workshop: {
    label: 'Workshop',
    icon: <GraduationCap className="h-3 w-3 mr-1" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  course: {
    label: 'Course',
    icon: <BookOpen className="h-3 w-3 mr-1" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  hackathon: {
    label: 'Hackathon',
    icon: <GraduationCap className="h-3 w-3 mr-1" />,
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
  },
  talk: {
    label: 'Talk',
    icon: <Mic className="h-3 w-3 mr-1" />,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  },
  party: {
    label: 'Party',
    icon: <Music className="h-3 w-3 mr-1" />,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
  },
  competition: {
    label: 'Competition',
    icon: <Medal className="h-3 w-3 mr-1" />,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  },
  career_fair: {
    label: 'Career Fair',
    icon: <Briefcase className="h-3 w-3 mr-1" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  volunteer: {
    label: 'Volunteer',
    icon: <HandHelping className="h-3 w-3 mr-1" />,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
  },
  live: {
    label: 'Live',
    icon: <Laptop className="h-3 w-3 mr-1" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  mentoria: {
    label: 'Mentoria',
    icon: <Headphones className="h-3 w-3 mr-1" />,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  }
};
