
import { ContentItem as LibraryContentItem } from '@/types/library';
import { ContentItem as ContentTypeItem } from '@/types/content';

/**
 * Adapts a library content item to a content type item
 */
export function adaptLibraryItemToContentType(item: LibraryContentItem): ContentTypeItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    format: item.format,
    thumbnail: item.thumbnail,
    thumbnailUrl: item.thumbnailUrl,
    community_id: item.community_id || '',
    created_at: item.created_at || item.createdAt || new Date().toISOString(),
    updated_at: item.updated_at || item.updatedAt || new Date().toISOString(),
    access_level: item.access_level || 'free',
    url: item.url,
    is_featured: item.is_featured || item.featured || false,
    views: item.views || 0,
    likes: item.likes || 0,
    duration: item.duration,
    category_id: item.category_id || item.categoryId,
    tags: item.tags,
    pointsEnabled: item.pointsEnabled,
    pointsValue: item.pointsValue,
    isNew: item.isNew,
    freeAccessesLeft: item.freeAccessesLeft,
    isExclusive: item.isExclusive,
    author: item.author,
    resourceUrl: item.resourceUrl,
    visibility: item.visibility as any,
    completionCriteria: item.completionCriteria as any,
    completionThreshold: item.completionThreshold,
    fileSize: item.fileSize,
    featured: item.featured || item.is_featured,
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
    allowComments: item.allowComments,
    content: item.content,
    categoryId: item.categoryId || item.category_id,
  };
}

/**
 * Adapts an array of library content items to content type items
 */
export function adaptLibraryArrayToContentType(items: LibraryContentItem[]): ContentTypeItem[] {
  return items.map(item => adaptLibraryItemToContentType(item));
}

/**
 * Adapts a content type item to a library content item
 */
export function adaptContentTypeToLibraryItem(item: ContentTypeItem): LibraryContentItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    format: item.format,
    thumbnail: item.thumbnail,
    thumbnailUrl: item.thumbnailUrl,
    community_id: item.community_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author: item.author,
    is_featured: item.is_featured,
    views: item.views,
    likes: item.likes,
    duration: item.duration,
    access_level: item.access_level,
    category_id: item.category_id,
    tags: item.tags,
    pointsEnabled: item.pointsEnabled,
    pointsValue: item.pointsValue,
    isNew: item.isNew,
    freeAccessesLeft: item.freeAccessesLeft,
    isExclusive: item.isExclusive,
    resourceUrl: item.resourceUrl,
    categoryId: item.categoryId,
    visibility: item.visibility,
    completionCriteria: item.completionCriteria,
    completionThreshold: item.completionThreshold,
    fileSize: item.fileSize,
    featured: item.featured,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    allowComments: item.allowComments,
    content: item.content,
  };
}

/**
 * Adapts an array of content type items to library content items
 */
export function adaptContentArrayToLibraryType(items: ContentTypeItem[]): LibraryContentItem[] {
  return items.map(item => adaptContentTypeToLibraryItem(item));
}
