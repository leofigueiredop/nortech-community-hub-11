
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
  community_id: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
  is_featured?: boolean;
  views?: number;
  likes?: number;
  duration?: number;
  access_level?: 'free' | 'premium' | 'premium_plus';
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
