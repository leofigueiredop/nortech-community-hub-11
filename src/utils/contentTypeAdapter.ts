
import { ContentItem as ContentLibraryItem } from '@/types/library';
import { ContentItem as ContentTypeItem, ContentFormat } from '@/types/content';

/**
 * Adapts a library ContentItem to the content type ContentItem
 * This addresses the incompatibility between the two types
 */
export function adaptLibraryToContentType(item: ContentLibraryItem): ContentTypeItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    url: item.url,
    format: item.format as ContentFormat,
    thumbnail: item.thumbnail || item.thumbnailUrl,
    thumbnailUrl: item.thumbnailUrl || item.thumbnail,
    community_id: item.community_id || 'default-community',
    created_at: item.created_at || item.createdAt || new Date().toISOString(),
    updated_at: item.updated_at || item.updatedAt || new Date().toISOString(),
    author_id: item.author_id,
    is_featured: item.is_featured || item.featured || false,
    views: item.views || 0,
    likes: item.likes || 0,
    duration: item.duration || 0,
    access_level: (item.access_level || item.accessLevel || 'free') as 'free' | 'premium' | 'premium_plus',
    category_id: item.category_id || item.categoryId,
    tags: item.tags || [],
    isNew: item.isNew,
    pointsEnabled: item.pointsEnabled,
    pointsValue: item.pointsValue,
    freeAccessesLeft: item.freeAccessesLeft,
    author: item.author,
    resourceUrl: item.resourceUrl,
    visibility: item.visibility as any,
    completionCriteria: item.completionCriteria as any,
    completionThreshold: item.completionThreshold,
    fileSize: item.fileSize,
    accessLevel: (item.accessLevel || item.access_level || 'free') as 'free' | 'premium' | 'premium_plus',
    featured: item.featured || item.is_featured || false,
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    allowComments: item.allowComments
  };
}

/**
 * Adapts an array of library ContentItems to content type ContentItems
 */
export function adaptLibraryArrayToContentType(items: ContentLibraryItem[]): ContentTypeItem[] {
  return items.map(adaptLibraryToContentType);
}
