
import { useState, useCallback } from 'react';
import { ContentItem, ContentFormat } from '@/types/library';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';

export const useContentItems = () => {
  const [content, setContent] = useState<ContentItem[]>(CONTENT_ITEMS);
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Get all unique tags from content items, safely handling undefined tags
  const allTags = Array.from(
    new Set(content.flatMap(item => (item.tags && Array.isArray(item.tags)) ? item.tags : []))
  ).sort();

  // Get all formats
  const allFormats = Array.from(
    new Set(content.map(item => item.format))
  );

  // Filter content based on current filters, with safe handling of potentially undefined fields
  const filteredContent = content.filter(item => {
    // Format filter
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
    
    // Tag filter - safely handle potentially undefined tags
    const matchesTag = tagFilter === 'all' || 
                     (item.tags && Array.isArray(item.tags) && item.tags.includes(tagFilter));
    
    // Access level filter
    const matchesAccess = accessFilter === 'all' || 
                        item.accessLevel === accessFilter ||
                        (accessFilter === 'unlockable' && item.pointsEnabled);
    
    // Search query
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFormat && matchesTag && matchesAccess && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'recommended':
        // This would typically use a more complex algorithm,
        // but for now we'll just sort by a combination of views and recency
        const aScore = a.views + (new Date(a.createdAt).getTime() / 1000000000);
        const bScore = b.views + (new Date(b.createdAt).getTime() / 1000000000);
        return bScore - aScore;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get featured content
  const featuredContent = content.filter(item => item.featured);

  // Add new content
  const addContent = useCallback((newContent: ContentItem) => {
    setContent(prev => [...prev, newContent]);
  }, []);

  // Update existing content
  const updateContent = useCallback((updatedContent: ContentItem) => {
    setContent(prev => 
      prev.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      )
    );
  }, []);

  // Delete content
  const deleteContent = useCallback((id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    content,
    filteredContent,
    featuredContent,
    allTags,
    allFormats,
    formatFilter,
    tagFilter,
    accessFilter,
    searchQuery,
    sortBy,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery,
    setSortBy,
    setSelectedItem,
    addContent,
    updateContent,
    deleteContent
  };
};
