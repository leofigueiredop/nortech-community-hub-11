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
}

// Mock events data
export const EVENTS: Event[] = [
  {
    id: 1,
    title: 'Web3 Workshop',
    description: 'Learn about Web3 and build your first dApp.',
    date: new Date('2024-08-15'),
    time: '14:00 - 16:00',
    type: 'workshop',
    location: 'Online',
    speaker: 'John Doe',
    attendees: 25,
    capacity: 50,
    image: '/images/web3_workshop.jpg',
  },
  {
    id: 2,
    title: 'AI Meetup',
    description: 'Discuss the latest trends in artificial intelligence.',
    date: new Date('2024-08-22'),
    time: '18:00 - 20:00',
    type: 'meetup',
    location: 'Nortech Office',
    speaker: 'Jane Smith',
    attendees: 60,
    capacity: 80,
    image: '/images/ai_meetup.jpg',
  },
  {
    id: 3,
    title: 'React Native Webinar',
    description: 'Build cross-platform mobile apps with React Native.',
    date: new Date('2024-09-05'),
    time: '10:00 - 12:00',
    type: 'webinar',
    location: 'Online',
    speaker: 'Mike Johnson',
    attendees: 120,
    capacity: 150,
    image: '/images/react_native_webinar.jpg',
  },
  {
    id: 4,
    title: 'Live Coding Session',
    description: 'Join us for a live coding session with expert developers.',
    date: new Date('2024-09-12'),
    time: '16:00 - 18:00',
    type: 'live',
    location: 'Nortech Office',
    speaker: 'Emily Brown',
    attendees: 40,
    capacity: 60,
    image: '/images/live_coding_session.jpg',
  },
  {
    id: 5,
    title: 'Mentorship Program',
    description: 'Get personalized mentorship from industry leaders.',
    date: new Date('2024-09-19'),
    time: '14:00 - 16:00',
    type: 'mentoria',
    location: 'Online',
    speaker: 'David Wilson',
    attendees: 15,
    capacity: 20,
    image: '/images/mentorship_program.jpg',
  },
  {
    id: 6,
    title: 'Advanced JavaScript Workshop',
    description: 'Deep dive into advanced JavaScript concepts and techniques.',
    date: new Date('2024-09-26'),
    time: '10:00 - 12:00',
    type: 'workshop',
    location: 'Online',
    speaker: 'Sarah Lee',
    attendees: 30,
    capacity: 40,
    image: '/images/javascript_workshop.jpg',
  },
  {
    id: 7,
    title: 'Cybersecurity Meetup',
    description: 'Discuss the latest cybersecurity threats and solutions.',
    date: new Date('2024-10-03'),
    time: '18:00 - 20:00',
    type: 'meetup',
    location: 'Nortech Office',
    speaker: 'Kevin Green',
    attendees: 70,
    capacity: 90,
    image: '/images/cybersecurity_meetup.jpg',
  },
  {
    id: 8,
    title: 'Vue.js Webinar',
    description: 'Learn how to build modern web applications with Vue.js.',
    date: new Date('2024-10-10'),
    time: '14:00 - 16:00',
    type: 'webinar',
    location: 'Online',
    speaker: 'Laura White',
    attendees: 110,
    capacity: 130,
    image: '/images/vuejs_webinar.jpg',
  },
  {
    id: 9,
    title: 'AR/VR Live Demo',
    description: 'Experience the latest augmented and virtual reality technologies.',
    date: new Date('2024-10-17'),
    time: '16:00 - 18:00',
    type: 'live',
    location: 'Nortech Office',
    speaker: 'Chris Black',
    attendees: 50,
    capacity: 70,
    image: '/images/arvr_demo.jpg',
  },
  {
    id: 10,
    title: 'Career Mentoring Session',
    description: 'Get advice on career development and job search strategies.',
    date: new Date('2024-10-24'),
    time: '10:00 - 12:00',
    type: 'mentoria',
    location: 'Online',
    speaker: 'Alice Gray',
    attendees: 10,
    capacity: 15,
    image: '/images/career_mentoring.jpg',
  },
];

// Helper functions for event status
export const getEventStatus = (event: Event): 'upcoming' | 'happening_soon' | 'in_progress' | 'ended' => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const eventTime = event.time.split(' - ')[0]; // Get start time
  const [hourStr, minuteStr] = eventTime.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  // Set event start and end time
  const eventStart = new Date(eventDate);
  eventStart.setHours(hour);
  eventStart.setMinutes(minute);
  
  // Approximate event end time (2 hours after start)
  const eventEnd = new Date(eventStart);
  eventEnd.setHours(eventEnd.getHours() + 2);
  
  // Check if event is happening soon (within 24 hours)
  const oneDay = 24 * 60 * 60 * 1000;
  const timeDiff = eventStart.getTime() - now.getTime();
  
  if (now > eventEnd) {
    return 'ended';
  } else if (now >= eventStart && now <= eventEnd) {
    return 'in_progress';
  } else if (timeDiff > 0 && timeDiff <= oneDay) {
    return 'happening_soon';
  } else {
    return 'upcoming';
  }
};

// Check if user is registered for an event
export const isUserRegistered = (event: Event, userId: string = 'current-user'): boolean => {
  return event.registeredUsers?.includes(userId) || false;
};
