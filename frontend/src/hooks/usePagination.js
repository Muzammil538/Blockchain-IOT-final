import { useState, useMemo } from 'react';

/**
 * Custom hook for handling pagination logic
 * @param {Array} data - The full dataset to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination state and methods
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => (
    Math.ceil(data.length / itemsPerPage)
  ), [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1
  };
};