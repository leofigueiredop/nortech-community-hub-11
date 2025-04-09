
import { useState, useCallback } from 'react';
import { ContentItem, ContentFormat } from '@/types/library';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';

export const useContentItems = () => {
  const [content, setContent] = useState<ContentItem[]>(CONTENT_ITEMS);
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Get all unique tags from content items
  const allTags = Array.from(
    new Set(content.flatMap(item => item.tags))
  ).sort();

  // Get all formats
  const allFormats = Array.from(
    new Set(content.map(item => item.format))
  );

  // Filter content based on current filters
  const filteredContent = content.filter(item => {
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
    const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);
    const matchesAccess = accessFilter === 'all' || item.accessLevel === accessFilter;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFormat && matchesTag && matchesAccess && matchesSearch;
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
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery,
    setSelectedItem,
    addContent,
    updateContent,
    deleteContent
  };
};
