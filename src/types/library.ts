
export type ContentFormat = 'audio' | 'pdf' | 'text' | 'url' | 'youtube' | 'vimeo' | 'gdoc' | 'image' | 'course' | 'link';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  format: ContentFormat;
  thumbnail: string;
  author: Author | string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  duration: number;
  accessLevel: 'free' | 'premium' | 'unlockable';
  featured: boolean;
  categoryId?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  resourceUrl?: string; // URL for the content resource
  visibility?: string; // Public, premium-only, etc.
  completionCriteria?: string; // Watch, read, etc.
  completionThreshold?: number; // Percentage or time needed for completion
  addToCarousel?: boolean;
}

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  icon?: string;
}

export interface ContentProgress {
  id: string;
  userId: string;
  contentId: string;
  progress: number;
  completed: boolean;
  lastAccessedAt: string;
  pointsAwarded: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: CourseModule[];
  accessLevel: 'free' | 'premium';
}

export interface CourseModule {
  id: string;
  title: string;
  items: CourseModuleItem[];
}

export interface CourseModuleItem {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'text' | 'assignment';
  contentId?: string;
  completed?: boolean;
}
