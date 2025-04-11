
import { useCallback } from 'react';
import { ContentItem } from '@/types/library';
import { useContentItems } from './useContentItems';
import { useCategories } from './useCategories';

export const useLibraryContent = () => {
  const contentHook = useContentItems();
  const categoriesHook = useCategories();

  // Enhanced functions to manage both content and categories together
  const addContent = useCallback((newContent: ContentItem) => {
    contentHook.addContent(newContent);
    
    // Update category count
    if (newContent.categoryId) {
      categoriesHook.incrementCategoryCount(newContent.categoryId);
    }
  }, [contentHook.addContent, categoriesHook.incrementCategoryCount]);

  const updateContent = useCallback((updatedContent: ContentItem) => {
    const existingItem = contentHook.content.find(item => item.id === updatedContent.id);
    
    // Handle category count changes
    if (existingItem && existingItem.categoryId !== updatedContent.categoryId) {
      // Decrease count in old category
      if (existingItem.categoryId) {
        categoriesHook.decrementCategoryCount(existingItem.categoryId);
      }
      
      // Increase count in new category
      if (updatedContent.categoryId) {
        categoriesHook.incrementCategoryCount(updatedContent.categoryId);
      }
    }
    
    contentHook.updateContent(updatedContent);
  }, [contentHook.content, contentHook.updateContent, categoriesHook.decrementCategoryCount, categoriesHook.incrementCategoryCount]);

  const deleteContent = useCallback((id: string) => {
    const itemToDelete = contentHook.content.find(item => item.id === id);
    
    // Update category count
    if (itemToDelete?.categoryId) {
      categoriesHook.decrementCategoryCount(itemToDelete.categoryId);
    }
    
    contentHook.deleteContent(id);
  }, [contentHook.content, contentHook.deleteContent, categoriesHook.decrementCategoryCount]);

  return {
    // Content state and methods
    content: contentHook.content,
    filteredContent: contentHook.filteredContent,
    featuredContent: contentHook.featuredContent,
    allTags: contentHook.allTags,
    allFormats: contentHook.allFormats,
    formatFilter: contentHook.formatFilter,
    tagFilter: contentHook.tagFilter,
    accessFilter: contentHook.accessFilter,
    searchQuery: contentHook.searchQuery,
    sortBy: contentHook.sortBy, 
    selectedItem: contentHook.selectedItem,
    setFormatFilter: contentHook.setFormatFilter,
    setTagFilter: contentHook.setTagFilter,
    setAccessFilter: contentHook.setAccessFilter,
    setSearchQuery: contentHook.setSearchQuery,
    setSortBy: contentHook.setSortBy,
    setSelectedItem: contentHook.setSelectedItem,
    addContent,
    updateContent,
    deleteContent,
    
    // Categories state and methods
    categories: categoriesHook.categories,
    addCategory: categoriesHook.addCategory,
    updateCategory: categoriesHook.updateCategory,
    deleteCategory: categoriesHook.deleteCategory,
  };
};
