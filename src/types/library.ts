
import { ContentFormat as BaseContentFormat, ContentCategory as BaseContentCategory } from './content';

// Re-export ContentFormat to avoid conflicts
export type ContentFormat = BaseContentFormat;

export interface ContentCategory extends BaseContentCategory {
  itemCount?: number;
  icon?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  format: ContentFormat | string;
  url?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration?: number;
  author?: string | {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  category_id?: string;
  categoryId?: string;
  tags?: string[];
  access_level?: 'free' | 'premium' | 'premium_plus';
  accessLevel?: 'free' | 'premium' | 'premium_plus';
  is_featured?: boolean;
  featured?: boolean;
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  allowComments?: boolean;
  community_id?: string;
  fileSize?: string;
  resourceUrl?: string;
  visibility?: string;
  completionCriteria?: string;
  completionThreshold?: number;
}
