/**
 * Add UUID type at the top
 */
type UUID = string; // Type alias for UUID strings

/**
 * Content format types
 */
export type ContentFormat = 'video' | 'article' | 'pdf' | 'course' | 'audio' | 'image' | 'link';

/**
 * Content item interface matching Supabase schema
 */
export interface ContentItem {
  id: UUID;
  title: string;
  description?: string;
  format: string;
  thumbnail?: string;
  thumbnail_url?: string;
  resource_url?: string;
  author_id?: UUID;
  duration?: number;
  tags?: string[];
  access_level: 'free' | 'premium' | 'unlockable';
  created_at: string;
  updated_at: string;
  views: number;
  category_id?: string;
  visibility: 'public' | 'private';
  featured: boolean;
  points_enabled: boolean;
  points_value: number;
  completion_criteria: string;
  completion_threshold: number;
  file_size?: number;
  space_id?: UUID;
  community_id: UUID;
}

/**
 * Content creation form data
 */
export interface ContentFormData {
  title: string;
  description?: string;
  format: ContentFormat;
  url?: string;
  file?: File;
  thumbnail?: File;
  category_id?: string;
  tags?: string[];
  access_level?: string;
  community_id?: string;
}

/**
 * Props for ContentSection component
 */
export interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  isTopTen?: boolean;
  onItemSelect?: (item: ContentItem) => void; // Added to fix property error
  viewAllUrl?: string;
  showNewBadge?: boolean;
  description?: string;
  viewAll?: string;
  layout?: string; // Added for components that use this prop
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
  itemCount?: number; // Added for UI convenience
}

// Content Types
export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'course' | 'link';

export interface ContentMetadata {
  title: string;
  description?: string;
  content?: string;
  format: ContentType;
  thumbnail?: string;
  resourceUrl?: string;
  duration?: number;
  fileSize?: number;
  mimeType?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  encoding?: string;
  bitrate?: number;
  author?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

// Content Type Adapter Interface
export interface ContentTypeAdapter<T extends ContentMetadata = ContentMetadata> {
  type: ContentType;
  validate(content: Partial<ContentItem>): Promise<boolean>;
  transform(content: Partial<ContentItem>): Promise<ContentItem>;
  extractMetadata(file: File | string): Promise<T>;
  generatePreview(content: ContentItem): Promise<string>;
  getStorageConfig(): {
    allowedMimeTypes: string[];
    maxFileSize: number;
    storagePrefix: string;
  };
}

// Base Content Adapter
export abstract class BaseContentAdapter<T extends ContentMetadata = ContentMetadata> implements ContentTypeAdapter<T> {
  abstract type: ContentType;
  
  async validate(content: Partial<ContentItem>): Promise<boolean> {
    if (!content.metadata?.title) {
      throw new Error('Title is required');
    }
    if (!content.metadata?.format) {
      throw new Error('Content format is required');
    }
    if (content.metadata.format !== this.type) {
      throw new Error(`Invalid content type. Expected ${this.type}`);
    }
    return true;
  }

  abstract transform(content: Partial<ContentItem>): Promise<ContentItem>;
  abstract extractMetadata(file: File | string): Promise<T>;
  abstract generatePreview(content: ContentItem): Promise<string>;
  abstract getStorageConfig(): {
    allowedMimeTypes: string[];
    maxFileSize: number;
    storagePrefix: string;
  };

  protected generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  protected async validateFileType(file: File, allowedTypes: string[]): Promise<boolean> {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
    return true;
  }

  protected async validateFileSize(file: File, maxSize: number): Promise<boolean> {
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
    }
    return true;
  }
}
