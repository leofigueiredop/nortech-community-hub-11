
import { Course, CourseModule, CourseModuleItem } from '@/types/library';

// Sample course data with modules and lessons
export const MOCK_COURSE: Course = {
  id: 'course-1',
  title: 'Building Modern Web Applications',
  description: 'Learn how to build scalable web applications using modern frameworks and best practices',
  thumbnail: '/assets/course-thumbnail.jpg',
  format: 'course',
  access_level: 'premium',
  community_id: 'community-1',
  created_at: '2023-04-15T10:00:00Z',
  updated_at: '2023-06-10T15:30:00Z',
  modules: [
    {
      id: 'module-1',
      title: 'Getting Started',
      items: [
        {
          id: 'item-1',
          title: 'Introduction to the Course',
          type: 'video',
          content: 'https://example.com/videos/intro.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-2',
          title: 'Setting Up Your Development Environment',
          type: 'video',
          content: 'https://example.com/videos/setup.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-3',
          title: 'Overview of Modern Web Technologies',
          type: 'document',
          content: 'https://example.com/docs/overview.pdf',
          completed: false
          // Removing contentId property that was causing errors
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Frontend Development',
      items: [
        {
          id: 'item-4',
          title: 'Component-Based Architecture',
          type: 'video',
          content: 'https://example.com/videos/components.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-5',
          title: 'State Management Patterns',
          type: 'video',
          content: 'https://example.com/videos/state.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-6',
          title: 'Responsive Design Principles',
          type: 'text',
          content: 'This lesson covers the fundamental principles of responsive design...',
          completed: false
          // Removing contentId property that was causing errors
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Backend Integration',
      items: [
        {
          id: 'item-7',
          title: 'API Design Best Practices',
          type: 'video',
          content: 'https://example.com/videos/api-design.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-8',
          title: 'Authentication and Authorization',
          type: 'video',
          content: 'https://example.com/videos/auth.mp4',
          completed: false
          // Removing contentId property that was causing errors
        },
        {
          id: 'item-9',
          title: 'Module Assignment - Build an API',
          type: 'assignment',
          content: 'Create a RESTful API with at least three endpoints that follow the principles discussed in this module.',
          completed: false
          // Removing contentId property that was causing errors
        }
      ]
    }
  ]
};

// Add this line to export MOCK_COURSE as sampleCourse
export const sampleCourse = MOCK_COURSE;
