import { ContentItem as LibraryContentItem } from '@/types/library';
import { ContentItem as ContentTypeItem } from '@/types/content';

/**
 * Adapts a library content item to the content type format
 */
export const adaptLibraryItemToContentType = (item: LibraryContentItem): ContentTypeItem => {
  return {
    ...item,
    description: item.description || '',
    accessLevel: item.access_level,
    categoryId: item.category_id,
    thumbnailUrl: item.thumbnail || item.thumbnailUrl,
    featured: item.is_featured || item.featured,
    pointsEnabled: item.points_enabled || false,
    pointsValue: item.points_value || 0,
    views: item.views || 0,
    duration: item.duration || 0,
    updatedAt: item.updated_at,
    createdAt: item.created_at
  } as ContentTypeItem;
};

/**
 * Adapts an array of library items to content type format
 */
export const adaptLibraryArrayToContentType = (items: LibraryContentItem[]): ContentTypeItem[] => {
  return items.map(item => adaptLibraryItemToContentType(item));
};

/**
 * Adapts a content type item to the library content format
 */
export const adaptContentTypeToLibrary = (item: ContentTypeItem): LibraryContentItem => {
  return {
    ...item,
    access_level: item.accessLevel || item.access_level || 'free',
    category_id: item.categoryId || item.category_id,
    thumbnail: item.thumbnailUrl || item.thumbnail,
    is_featured: item.featured || item.is_featured || false,
    points_enabled: item.pointsEnabled || item.points_enabled || false,
    points_value: item.pointsValue || item.points_value || 0,
    updated_at: item.updatedAt || item.updated_at,
    created_at: item.createdAt || item.created_at
  } as LibraryContentItem;
};
