import { useState, useEffect, useMemo } from 'react';
import { ContentItem, ContentCategory } from '@/types/content';
import { useApi } from './useApi';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { StorageService } from '@/services/StorageService';

export const useLibraryContent = () => {
  const { client } = useApi();
  const { user, community } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected item for viewing
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  
  // Filtered content state
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string | null>(null);
  
  // UI state for filters
  const [formatFilter, setFormatFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await client.content.list({
          communityId: community?.id
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        setContent(result.data.items);
        setFilteredContent(result.data.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load content';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (community) {
      fetchContent();
    }
  }, [client, community]);
  
  // Filter content when filter conditions change
  useEffect(() => {
    if (!content.length) return;
    
    let filtered = [...content];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }
    
    // Apply format filter
    if (selectedFormat && selectedFormat !== 'all') {
      filtered = filtered.filter(item => item.format === selectedFormat);
    }
    
    // Apply access level filter
    if (selectedAccessLevel && selectedAccessLevel !== 'all') {
      filtered = filtered.filter(item => item.access_level === selectedAccessLevel);
    }
    
    // Apply format filter from UI
    if (formatFilter !== 'all') {
      filtered = filtered.filter(item => item.format.toLowerCase() === formatFilter.toLowerCase());
    }
    
    // Apply tag filter from UI
    if (tagFilter) {
      filtered = filtered.filter(item => 
        item.tags && item.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
      );
    }
    
    // Apply access filter from UI
    if (accessFilter !== 'all') {
      filtered = filtered.filter(item => item.access_level === accessFilter);
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredContent(filtered);
  }, [content, searchQuery, selectedCategory, selectedFormat, selectedAccessLevel, formatFilter, tagFilter, accessFilter, sortBy]);
  
  // Extract featured content
  const featuredContent = useMemo(() => {
    return content.filter(item => item.featured);
  }, [content]);
  
  // Extract all unique formats
  const allFormats = useMemo(() => {
    const formatSet = new Set<string>();
    content.forEach(item => {
      formatSet.add(item.format);
    });
    return Array.from(formatSet);
  }, [content]);
  
  // Add new content item
  const addContent = async (newContent: Partial<ContentItem>, file?: File): Promise<ContentItem | null> => {
    try {
      setLoading(true);
      
      // Handle file upload if provided
      let thumbnailUrl = newContent.thumbnail;
      if (file && community) {
        thumbnailUrl = await StorageService.uploadFile(
          file,
          community.id,
          'content',
          { customFileName: `thumbnail-${Date.now()}` }
        );
      }
      
      const result = await client.content.create({
        ...newContent,
        thumbnail: thumbnailUrl || null,
        community_id: community?.id,
        author_id: user?.id
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      setContent(prev => [...prev, result.data]);
      toast({
        title: 'Success',
        description: `${newContent.title} has been added to your library.`
      });
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add content';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update existing content
  const updateContent = async (id: string, updates: Partial<ContentItem>, file?: File): Promise<ContentItem | null> => {
    try {
      setLoading(true);
      
      // Handle file upload if provided
      let thumbnailUrl = updates.thumbnail;
      if (file && community) {
        thumbnailUrl = await StorageService.uploadFile(
          file,
          community.id,
          'content',
          { customFileName: `thumbnail-${Date.now()}` }
        );
      }
      
      const result = await client.content.update(id, {
        ...updates,
        thumbnail: thumbnailUrl || undefined
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      setContent(prev => prev.map(item => item.id === id ? result.data : item));
      toast({
        title: 'Success',
        description: 'Content updated successfully.'
      });
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update content';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete content
  const deleteContent = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Find the content to get the thumbnail URL for deletion
      const contentToDelete = content.find(item => item.id === id);
      
      const result = await client.content.delete(id);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Delete thumbnail if it exists
      if (contentToDelete?.thumbnail && community) {
        await StorageService.deleteFile(contentToDelete.thumbnail);
      }
      
      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'The content has been removed from your library.'
      });
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete content';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add category - placeholder for now until we add category management UI
  const addCategory = async (category: Partial<ContentCategory>): Promise<ContentCategory | null> => {
    // Implement when we have category management UI
    console.log('Adding category:', category);
    return null;
  };
  
  // Update category
  const updateCategory = async (id: string, category: Partial<ContentCategory>): Promise<ContentCategory | null> => {
    // Implement when we have category management UI
    console.log('Updating category:', id, category);
    return null;
  };
  
  // Delete category
  const deleteCategory = async (id: string): Promise<boolean> => {
    // Implement when we have category management UI
    console.log('Deleting category:', id);
    return false;
  };
  
  // Extract all unique tags from content
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    content.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [content]);
  
  return {
    content,
    allContent: content,
    loading,
    error,
    categories,
    allTags,
    allFormats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFormat,
    setSelectedFormat,
    selectedAccessLevel,
    setSelectedAccessLevel,
    formatFilter,
    setFormatFilter,
    tagFilter,
    setTagFilter,
    accessFilter,
    setAccessFilter,
    sortBy,
    setSortBy,
    featuredContent,
    filteredContent,
    selectedItem,
    setSelectedItem,
    addContent,
    updateContent,
    deleteContent,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
