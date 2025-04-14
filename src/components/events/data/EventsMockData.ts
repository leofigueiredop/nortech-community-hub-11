
import { Event } from '../types/EventTypes';

// Helper to create dates relative to today
const getDate = (daysFromNow: number, hours = 18, minutes = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Community Workshop: Getting Started with AI",
    description: "Join us for an interactive workshop where we'll explore the basics of AI and how to leverage it in your projects. Perfect for beginners!",
    type: "workshop",
    date: getDate(2),
    time: "18:00 - 20:00",
    location: "Online via Zoom",
    speaker: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 24,
    capacity: 50,
    isRegistered: false,
    url: "https://zoom.us/j/123456789",
    platform: "zoom",
    pointsValue: 10
  },
  {
    id: 2,
    title: "Monthly Networking Mixer",
    description: "Connect with other community members in a casual setting. Share ideas, find collaborators, and expand your professional network.",
    type: "meetup",
    date: getDate(5),
    time: "19:00 - 21:00",
    location: "TechHub, 123 Innovation Street",
    speaker: "Community Team",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    attendees: 18,
    capacity: 30,
    isRegistered: false
  },
  {
    id: 3,
    title: "Tech Conference 2023",
    description: "Our annual technology conference featuring industry experts, hands-on workshops, and networking opportunities. Don't miss this flagship event!",
    type: "conference",
    date: getDate(15),
    time: "09:00 - 17:00",
    location: "Grand Conference Center",
    speaker: "Multiple Speakers",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 120,
    capacity: 200,
    isRegistered: false,
    pointsValue: 50
  },
  {
    id: 4,
    title: "Introduction to Web3 & Blockchain",
    description: "Learn the fundamentals of blockchain technology and Web3 applications in this beginner-friendly webinar.",
    type: "webinar",
    date: getDate(3),
    time: "17:00 - 18:30",
    location: "Online via Google Meet",
    speaker: "Michael Chen",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    attendees: 56,
    capacity: 100,
    isRegistered: false,
    url: "https://meet.google.com/abc-defg-hij",
    platform: "meet",
    pointsValue: 15
  },
  {
    id: 5,
    title: "Career Fair: Tech Jobs 2023",
    description: "Connect with top employers in the tech industry. Bring your resume and be ready for on-site interviews!",
    type: "career_fair",
    date: getDate(20),
    time: "10:00 - 16:00",
    location: "University Tech Center",
    speaker: "Various Employers",
    image: "https://images.unsplash.com/photo-1560523159-4a9692d222f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 89,
    capacity: 150,
    isRegistered: false
  },
  {
    id: 6,
    title: "Python for Data Science (8-Week Course)",
    description: "A comprehensive course teaching Python programming specifically for data science applications. Limited spots available!",
    type: "course",
    date: getDate(10),
    time: "18:30 - 20:30",
    location: "Online via Zoom + Learning Platform",
    speaker: "Dr. Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    attendees: 23,
    capacity: 25,
    isRegistered: false,
    url: "https://zoom.us/j/987654321",
    platform: "zoom",
    pointsValue: 100
  },
  {
    id: 7,
    title: "Community Service: Tech for Nonprofits",
    description: "Give back to the community by helping local nonprofits with their technology needs. All skill levels welcome!",
    type: "volunteer",
    date: getDate(8),
    time: "09:00 - 13:00",
    location: "Community Center, 456 Main Street",
    speaker: "Volunteer Coordinators",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 12,
    capacity: 20,
    isRegistered: false,
    pointsValue: 30
  },
  {
    id: 8,
    title: "Hackathon: Build a Solution in 48 Hours",
    description: "Form a team and compete to build innovative solutions to real-world problems. Prizes for the top three teams!",
    type: "competition",
    date: getDate(25),
    time: "09:00 - 17:00 (spans 2 days)",
    location: "TechHub Innovation Space",
    speaker: "Judging Panel",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 45,
    capacity: 60,
    isRegistered: false,
    pointsValue: 75
  },
  {
    id: 9,
    title: "Live Session: Q&A with Industry Experts",
    description: "Join our panel of industry experts for a live Q&A session. Submit your questions in advance or during the event.",
    type: "live",
    date: getDate(1, 16, 0),
    time: "16:00 - 17:30",
    location: "Online via Teams",
    speaker: "Expert Panel",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    attendees: 34,
    capacity: 100,
    isRegistered: false,
    url: "https://teams.microsoft.com/l/meetup-join/abc123",
    platform: "teams",
    pointsValue: 15
  },
  {
    id: 10,
    title: "Mentoria: Career Development Strategy",
    description: "One-on-one mentorship session focusing on career development in the tech industry. Limited spots available.",
    type: "mentoria",
    date: getDate(-1, 10, 0),
    time: "10:00 - 11:00",
    location: "Online via Google Meet",
    speaker: "Various Mentors",
    image: "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80",
    attendees: 5,
    capacity: 5,
    isRegistered: false,
    url: "https://meet.google.com/xyz-abcd-123",
    platform: "meet",
    status: 'ended',
    pointsValue: 20
  }
];
