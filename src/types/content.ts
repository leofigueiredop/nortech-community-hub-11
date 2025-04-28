
/**
 * Content format types
 */
export type ContentFormat = 'video' | 'text' | 'document';

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
  author_id?: string;
  is_featured?: boolean;
  views?: number;
  likes?: number;
  duration?: number;
  access_level?: 'free' | 'premium' | 'premium_plus';
  resourceUrl?: string;
  
  // Additional properties needed by components
  isNew?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
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
}
