import { Event } from '../types/EventTypes';

// Generate random dates for events
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

// Mock events data
export const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Community React Workshop',
    description: 'Learn the fundamentals of React and build your first application with our experienced instructors.',
    type: 'workshop',
    date: tomorrow,
    time: '10:00 AM - 2:00 PM',
    location: 'Tech Hub, Building A',
    speaker: 'Sarah Johnson',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 18,
    capacity: 30,
    pointsValue: 150,
    badgeName: 'React Enthusiast',
    registeredUsers: []
  },
  {
    id: 2,
    title: 'Coffee & Code Meetup',
    description: 'Casual gathering for developers to work on projects, share ideas, and enjoy coffee together.',
    type: 'meetup',
    date: today,
    time: '3:00 PM - 5:00 PM',
    location: 'Brew Code Café',
    speaker: 'Community Members',
    image: null,
    status: 'happening_soon',
    isRegistered: true,
    attendees: 12,
    capacity: 20,
    pointsValue: 50,
    badgeName: 'Networking Pro',
    registeredUsers: ['current-user']
  },
  {
    id: 3,
    title: 'Annual Developer Conference',
    description: 'Our biggest event of the year with keynotes, technical sessions, and networking opportunities.',
    type: 'conference',
    date: nextWeek,
    time: '9:00 AM - 6:00 PM',
    location: 'Grand Convention Center',
    speaker: 'Multiple Speakers',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 342,
    capacity: 500,
    pointsValue: 300,
    badgeName: 'Conference Guru',
    registeredUsers: []
  },
  {
    id: 4,
    title: 'Introduction to AI Webinar',
    description: 'Learn about the basics of artificial intelligence and how it\'s changing the tech landscape.',
    type: 'webinar',
    date: tomorrow,
    time: '1:00 PM - 2:30 PM',
    location: 'Online',
    speaker: 'Dr. Michael Chen',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 156,
    capacity: 1000,
    url: 'https://zoom.us/j/123456789',
    platform: 'zoom',
    pointsValue: 100,
    badgeName: 'AI Explorer'
  },
  {
    id: 5,
    title: 'Tech Career Fair',
    description: 'Connect with top tech companies hiring for various positions from entry-level to senior roles.',
    type: 'career_fair',
    date: nextWeek,
    time: '10:00 AM - 4:00 PM',
    location: 'University Tech Center',
    speaker: 'HR Representatives',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 78,
    capacity: 200,
    pointsValue: 75,
    badgeName: 'Career Networker'
  },
  {
    id: 6,
    title: 'Data Structures & Algorithms Course',
    description: 'A comprehensive course covering essential computer science concepts for interviews and practical application.',
    type: 'course',
    date: today,
    time: '6:00 PM - 8:00 PM',
    location: 'Learning Center, Room 4B',
    speaker: 'Prof. David Miller',
    image: null,
    status: 'in_progress',
    isRegistered: true,
    attendees: 25,
    capacity: 25,
    pointsValue: 250,
    badgeName: 'Algorithm Master'
  },
  {
    id: 7,
    title: 'Community Website Hackathon',
    description: 'Help rebuild the community website with modern tools and improve the user experience.',
    type: 'volunteer',
    date: tomorrow,
    time: '9:00 AM - 5:00 PM',
    location: 'Community Center',
    speaker: 'Community Team',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 15,
    capacity: 20,
    pointsValue: 200,
    badgeName: 'Community Builder'
  },
  {
    id: 8,
    title: 'Code Challenge: Optimization Battle',
    description: 'Compete against other developers to create the most efficient solution to a set of problems.',
    type: 'competition',
    date: nextWeek,
    time: '1:00 PM - 5:00 PM',
    location: 'Online',
    speaker: 'Judge Panel',
    image: null,
    status: 'upcoming',
    isRegistered: false,
    attendees: 64,
    capacity: 100,
    url: 'https://codebattle.com/event123',
    platform: 'other',
    pointsValue: 350,
    badgeName: 'Code Champion'
  },
  {
    id: 9,
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.',
    type: 'workshop',
    date: lastWeek,
    time: '10:00 AM - 3:00 PM',
    location: 'Tech Hub, Building B',
    speaker: 'Jessica Lee',
    image: null,
    status: 'ended',
    isRegistered: true,
    attendees: 28,
    capacity: 30,
    pointsValue: 150,
    badgeName: 'Web Developer'
  }
];

// Export for EventsWeekly component
export const EVENTS = mockEvents;
