
import React from 'react';
import { Calendar, Users, Video, Laptop, Headphones, Star } from 'lucide-react';

// Define the event types with their labels, colors, and icons
export const EVENT_TYPES = {
  workshop: {
    label: 'Workshop',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: <Users size={14} className="mr-1" />
  },
  meetup: {
    label: 'Meetup',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: <Calendar size={14} className="mr-1" />
  },
  webinar: {
    label: 'Webinar',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    icon: <Video size={14} className="mr-1" />
  },
  live: {
    label: 'Live',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    icon: <Laptop size={14} className="mr-1" />
  },
  mentoria: {
    label: 'Mentoria',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    icon: <Headphones size={14} className="mr-1" />
  }
};

// Helper function for getting type filters (used in EventsHeader)
export const getTypeFilters = () => {
  return Object.entries(EVENT_TYPES).map(([type, details]) => ({
    type,
    details
  }));
};

// Event interface definition
export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: keyof typeof EVENT_TYPES;
  location: string;
  speaker: string;
  attendees: number;
  capacity: number;
  image: string | null;
  registeredUsers?: string[]; // Add registered users array
  status?: 'upcoming' | 'happening_soon' | 'in_progress' | 'ended'; // Add event status
  pointsValue?: number; // Add points value field
  badgeName?: string; // Add badge name field
}
