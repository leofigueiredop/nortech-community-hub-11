
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';

// Mock data types
interface Post {
  id: string;
  title: string;
  preview?: string;
  tags?: string[];
}

interface Course {
  id: string;
  title: string;
  preview?: string;
}

interface Event {
  id: string;
  title: string;
  date?: string;
}

interface SearchResults {
  posts: Post[];
  courses: Course[];
  library: ContentItem[];
  events: Event[];
}

// Mock data
const POSTS: Post[] = [
  { id: '1', title: 'Introduction to Web Development', preview: 'Learn the basics of HTML, CSS and JavaScript', tags: ['web', 'development', 'beginner'] },
  { id: '2', title: 'React Hooks Deep Dive', preview: 'Understanding React Hooks and their use cases', tags: ['react', 'hooks', 'advanced'] },
  { id: '3', title: 'Building with Next.js', preview: 'Create full-stack applications with Next.js', tags: ['nextjs', 'fullstack', 'react'] },
  { id: '4', title: 'Web3 Development Fundamentals', preview: 'Learn the basics of blockchain development', tags: ['web3', 'blockchain', 'ethereum'] },
  { id: '5', title: 'Finance for Developers', preview: 'Essential financial knowledge for tech professionals', tags: ['finance', 'career', 'personal'] },
];

const COURSES: Course[] = [
  { id: '1', title: 'Complete JavaScript Course', preview: 'From zero to hero in JavaScript' },
  { id: '2', title: 'React Mastery', preview: 'Master React and build complex applications' },
  { id: '3', title: 'TypeScript for React Developers', preview: 'Learn to use TypeScript with React' },
  { id: '4', title: 'Web3 and Blockchain Programming', preview: 'Build decentralized applications' },
  { id: '5', title: 'Finance Applications with React', preview: 'Create financial dashboards and tools' },
];

const EVENTS: Event[] = [
  { id: '1', title: 'JavaScript Conference', date: 'May 15, 2025' },
  { id: '2', title: 'React Meetup', date: 'June 10, 2025' },
  { id: '3', title: 'Web3 Workshop', date: 'July 5, 2025' },
  { id: '4', title: 'Financial Technology Summit', date: 'August 20, 2025' },
  { id: '5', title: 'Code Retreat', date: 'September 3, 2025' },
];

export const useSearchResults = (query: string) => {
  const [results, setResults] = useState<SearchResults>({ posts: [], courses: [], library: [], events: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ posts: [], courses: [], library: [], events: [] });
      return;
    }

    const searchContent = async () => {
      setIsLoading(true);
      
      // Add a slight delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        // Normalize query for searching
        const searchTerm = query.toLowerCase();
        const isHashtagSearch = searchTerm.startsWith('#');
        const hashtagValue = isHashtagSearch ? searchTerm.substring(1) : null;

        // Search posts
        const matchedPosts = POSTS.filter(post => {
          if (isHashtagSearch && post.tags) {
            return post.tags.some(tag => tag.toLowerCase() === hashtagValue);
          }
          return (
            post.title.toLowerCase().includes(searchTerm) || 
            (post.preview && post.preview.toLowerCase().includes(searchTerm))
          );
        });

        // Search courses
        const matchedCourses = COURSES.filter(course => 
          course.title.toLowerCase().includes(searchTerm) || 
          (course.preview && course.preview.toLowerCase().includes(searchTerm))
        );

        // Search library items
        const matchedLibrary = CONTENT_ITEMS.filter(item => 
          item.title.toLowerCase().includes(searchTerm) || 
          item.description.toLowerCase().includes(searchTerm) ||
          (item.tags && item.tags.some(tag => 
            isHashtagSearch ? tag.toLowerCase() === hashtagValue : tag.toLowerCase().includes(searchTerm)
          ))
        );

        // Search events
        const matchedEvents = EVENTS.filter(event => 
          event.title.toLowerCase().includes(searchTerm) || 
          (event.date && event.date.toLowerCase().includes(searchTerm))
        );

        setResults({
          posts: matchedPosts,
          courses: matchedCourses,
          library: matchedLibrary,
          events: matchedEvents
        });
      } catch (error) {
        console.error("Error searching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceSearch = setTimeout(() => {
      searchContent();
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [query]);

  return { results, isLoading };
};
