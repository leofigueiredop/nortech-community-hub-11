import { ContentItem } from '@/types/content';

export interface FilterOptions {
  searchQuery?: string;
  contentType?: string;
  accessLevel?: string;
  tags?: string[];
  space?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class FilterService {
  static filterContent(items: ContentItem[], options: FilterOptions): ContentItem[] {
    return items.filter(item => {
      // Search query filter
      if (options.searchQuery && !this.matchesSearchQuery(item, options.searchQuery)) {
        return false;
      }

      // Content type filter
      if (options.contentType && options.contentType !== 'all' && item.format !== options.contentType) {
        return false;
      }

      // Access level filter
      if (options.accessLevel && options.accessLevel !== 'all' && item.access_level !== options.accessLevel) {
        return false;
      }

      // Tags filter
      if (options.tags && options.tags.length > 0 && !this.matchesTags(item, options.tags)) {
        return false;
      }

      // Space filter
      if (options.space && options.space !== 'all' && item.space_id !== options.space) {
        return false;
      }

      // Date range filter
      if (options.dateRange && !this.isInDateRange(item, options.dateRange)) {
        return false;
      }

      return true;
    });
  }

  private static matchesSearchQuery(item: ContentItem, query: string): boolean {
    const searchTerms = query.toLowerCase().split(' ');
    const itemText = `${item.title} ${item.description}`.toLowerCase();
    
    return searchTerms.every(term => itemText.includes(term));
  }

  private static matchesTags(item: ContentItem, tags: string[]): boolean {
    return tags.every(tag => item.tags?.includes(tag));
  }

  private static isInDateRange(item: ContentItem, dateRange: { start: Date; end: Date }): boolean {
    const itemDate = new Date(item.created_at);
    return itemDate >= dateRange.start && itemDate <= dateRange.end;
  }

  static sortContent(items: ContentItem[], sortBy: string): ContentItem[] {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }
} 