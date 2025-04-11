
import { useState, useCallback } from 'react';
import { ContentCategory } from '@/types/library';

// Initial categories (same as in mockLibraryData)
const initialCategories: ContentCategory[] = [
  {
    id: 'cat1',
    name: 'Getting Started',
    description: 'Introduction to the platform and basic concepts',
    itemCount: 5,
    icon: 'rocket'
  },
  {
    id: 'cat2',
    name: 'Tutorials',
    description: 'Step-by-step guides for common tasks',
    itemCount: 8,
    icon: 'book-open'
  },
  {
    id: 'cat3',
    name: 'Advanced Topics',
    description: 'Deep dives into complex subjects',
    itemCount: 3,
    icon: 'zap'
  },
  {
    id: 'cat4',
    name: 'Community Resources',
    description: 'Content created by community members',
    itemCount: 6,
    icon: 'users'
  }
];

export const useCategories = () => {
  const [categories, setCategories] = useState<ContentCategory[]>(initialCategories);

  // Add a new category
  const addCategory = useCallback((category: ContentCategory) => {
    setCategories(prev => [...prev, category]);
  }, []);

  // Update an existing category
  const updateCategory = useCallback((updatedCategory: ContentCategory) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  }, []);

  // Delete a category
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  }, []);

  // Increment item count for a category
  const incrementCategoryCount = useCallback((id: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, itemCount: category.itemCount + 1 } 
          : category
      )
    );
  }, []);

  // Decrement item count for a category
  const decrementCategoryCount = useCallback((id: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, itemCount: Math.max(0, category.itemCount - 1) } 
          : category
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
