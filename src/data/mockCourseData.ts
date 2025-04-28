
import { Course } from '@/types/library';

export const sampleCourse: Course = {
  id: "react-mastery-2024",
  title: "React Mastery 2024",
  description: "Master modern React development with hands-on projects and advanced concepts. Learn hooks, state management, and best practices.",
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
  accessLevel: "free", // Changed from premium to free
  modules: [
    {
      id: "m1",
      title: "Getting Started with React",
      items: [
        {
          id: "m1-l1",
          title: "Introduction to React Development",
          type: "video",
          content: "intro-video",
          completed: false
        },
        {
          id: "m1-l2",
          title: "Setting Up Your Development Environment",
          type: "video",
          content: "setup-video",
          completed: false
        },
        {
          id: "m1-l3",
          title: "Your First React Component",
          type: "video",
          content: "component-video",
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
          content: "jsx-video",
          completed: false
        },
        {
          id: "m2-l2",
          title: "Props and State",
          type: "video",
          content: "props-state-video",
          completed: false
        },
        {
          id: "m2-l3",
          title: "Fundamentals Quiz",
          type: "quiz",
          content: "fundamentals-quiz",
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
          content: "hooks-video",
          completed: false
        },
        {
          id: "m3-l2",
          title: "Context API and State Management",
          type: "video",
          content: "context-video",
          completed: false
        },
        {
          id: "m3-l3",
          title: "Custom Hook Exercise",
          type: "exercise",
          content: "hook-assignment",
          completed: false
        }
      ]
    }
  ]
};
