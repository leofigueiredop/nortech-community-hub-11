
import React from 'react';
import { Video, Users, Presentation, BookOpen } from 'lucide-react';

export const EVENT_TYPES = {
  workshop: { 
    label: "Workshop", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: <BookOpen size={14} className="mr-1" />
  },
  meetup: { 
    label: "Meetup", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <Users size={14} className="mr-1" />
  },
  webinar: { 
    label: "Webinar", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: <Presentation size={14} className="mr-1" />
  },
  live: { 
    label: "Live Session", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <Video size={14} className="mr-1" />
  },
  mentoria: { 
    label: "Mentoring", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    icon: <Users size={14} className="mr-1" />
  }
};

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
}

// Mock event data with more variety
export const EVENTS: Event[] = [
  {
    id: 1,
    title: "React Workshop: Building Modern UIs",
    description: "Learn how to build beautiful UIs with React and modern design principles",
    date: new Date(2025, 3, 8), // April 8, 2025
    time: "10:00 AM - 12:00 PM",
    type: "workshop",
    location: "Online",
    speaker: "Alex Johnson",
    attendees: 24,
    capacity: 30,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Community Q&A Session",
    description: "Open discussion and Q&A with the community members",
    date: new Date(2025, 3, 10), // April 10, 2025
    time: "6:00 PM - 7:30 PM",
    type: "meetup",
    location: "Online",
    speaker: "Emma Wilson",
    attendees: 15,
    capacity: 50,
    image: null
  },
  {
    id: 3,
    title: "State Management Deep Dive",
    description: "Exploring different state management solutions and when to use them",
    date: new Date(2025, 3, 15), // April 15, 2025
    time: "2:00 PM - 4:00 PM",
    type: "webinar",
    location: "Online",
    speaker: "Marcus Chen",
    attendees: 42,
    capacity: 100,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "1:1 Mentoring Session",
    description: "Personal career guidance and code review with a senior developer",
    date: new Date(2025, 3, 20), // April 20, 2025
    time: "3:00 PM - 4:00 PM",
    type: "mentoria",
    location: "Online",
    speaker: "Sophia Garcia",
    attendees: 1,
    capacity: 1,
    image: null
  },
  {
    id: 5,
    title: "Live Coding: Building a Full-Stack App",
    description: "Watch as we build a complete application from scratch with React and Node.js",
    date: new Date(2025, 3, 22), // April 22, 2025
    time: "1:00 PM - 3:00 PM",
    type: "live",
    location: "YouTube Live",
    speaker: "David Kim",
    attendees: 135,
    capacity: 500,
    image: "https://images.unsplash.com/photo-1610986603166-f78428624e76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const getTypeFilters = () => {
  return Object.entries(EVENT_TYPES).map(([type, details]) => ({
    type,
    details
  }));
};
