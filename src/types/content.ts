
/**
 * Content format types
 */
export type ContentFormat = 'video' | 'text' | 'document' | 'audio' | 'course' | 'image' | 'link' | 'youtube' | 'vimeo' | 'gdoc' | 'pdf' | string;

/**
 * Content item interface
 */
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  format: ContentFormat;
  thumbnail?: string;
  thumbnailUrl?: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  author?: string | {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  is_featured?: boolean;
  views?: number;
  likes?: number;
  duration?: number;
  access_level: 'free' | 'premium' | 'premium_plus';
  category_id?: string;
  tags?: string[];
  content?: string;
  
  // Additional properties needed by components
  isNew?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  isExclusive?: boolean;
  
  // Properties used in various components
  resourceUrl?: string;
  categoryId?: string;
  visibility?: 'public' | 'premium' | 'points' | 'hidden' | 'vip-only' | 'limited-time';
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number;
  fileSize?: number | string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  allowComments?: boolean;
}

/**
 * Content creation form data
 */
export interface ContentFormData {
  title: string;
  description: string;
  url?: string;
  format: ContentFormat;
  community_id: string;
  thumbnail_url?: string;
}

/**
 * Props for ContentSection component
 */
export interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  isTopTen?: boolean;
  onItemSelect?: (item: ContentItem) => void;
  viewAllUrl?: string;
  showNewBadge?: boolean;
  description?: string;
  viewAll?: string;
  layout?: string;
}

/**
 * Content category
 */
export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  item_count?: number;
}
