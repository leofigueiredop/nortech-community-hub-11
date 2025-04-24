
import { Course } from '@/types/library';

export const sampleCourse: Course = {
  id: "react-mastery-2024",
  title: "React Mastery 2024",
  description: "Master modern React development with hands-on projects and advanced concepts. Learn hooks, state management, and best practices.",
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
  accessLevel: "premium",
  modules: [
    {
      id: "m1",
      title: "Getting Started with React",
      items: [
        {
          id: "m1-l1",
          title: "Introduction to React Development",
          type: "video",
          contentId: "intro-video",
          completed: false
        },
        {
          id: "m1-l2",
          title: "Setting Up Your Development Environment",
          type: "video",
          contentId: "setup-video",
          completed: false
        },
        {
          id: "m1-l3",
          title: "Your First React Component",
          type: "video",
          contentId: "component-video",
          completed: false
        }
      ]
    },
    {
      id: "m2",
      title: "React Fundamentals",
      items: [
        {
          id: "m2-l1",
          title: "Understanding JSX",
          type: "video",
          contentId: "jsx-video",
          completed: false
        },
        {
          id: "m2-l2",
          title: "Props and State",
          type: "video",
          contentId: "props-state-video",
          completed: false
        },
        {
          id: "m2-l3",
          title: "Fundamentals Quiz",
          type: "quiz",
          contentId: "fundamentals-quiz",
          completed: false
        }
      ]
    },
    {
      id: "m3",
      title: "Advanced React Patterns",
      items: [
        {
          id: "m3-l1",
          title: "React Hooks Deep Dive",
          type: "video",
          contentId: "hooks-video",
          completed: false
        },
        {
          id: "m3-l2",
          title: "Context API and State Management",
          type: "video",
          contentId: "context-video",
          completed: false
        },
        {
          id: "m3-l3",
          title: "Assignment: Build a Custom Hook",
          type: "assignment",
          contentId: "hook-assignment",
          completed: false
        }
      ]
    }
  ]
};
