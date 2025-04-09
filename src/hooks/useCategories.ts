
import { useState, useCallback } from 'react';
import { ContentCategory } from '@/types/library';
import { CATEGORIES } from '@/data/mockLibraryData';

export const useCategories = () => {
  const [categories, setCategories] = useState<ContentCategory[]>(CATEGORIES);

  // Add category
  const addCategory = useCallback((category: ContentCategory) => {
    setCategories(prev => [...prev, category]);
  }, []);

  // Update category
  const updateCategory = useCallback((updatedCategory: ContentCategory) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  }, []);

  // Delete category
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  // Update category count
  const incrementCategoryCount = useCallback((categoryId: string | undefined) => {
    if (!categoryId) return;
    
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, count: cat.count + 1 } 
          : cat
      )
    );
  }, []);

  const decrementCategoryCount = useCallback((categoryId: string | undefined) => {
    if (!categoryId) return;
    
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, count: Math.max(0, cat.count - 1) } 
          : cat
      )
    );
  }, []);

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    incrementCategoryCount,
    decrementCategoryCount
  };
};
