
import { useState, useEffect } from 'react';

export const usePagination = (
  totalItems: number, 
  itemsPerPage: number,
  dependencies: any[] = []
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to first page when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, [...dependencies]);
  
  const paginatedItems = (items: any[]) => {
    return items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };
  
  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems
  };
};
