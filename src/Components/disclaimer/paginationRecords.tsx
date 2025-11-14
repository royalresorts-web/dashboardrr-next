"use client";
import React, { useMemo, useCallback, FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Using lucide-react for modern icons

// Interface for Pagination component props
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// The Pagination component handles the display logic for page buttons.
const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange, className = '' }) => {
  // Define a type union for a page item (either a number or the ellipsis string)
  type PageItem = number | '...';

  const getVisiblePages = useCallback((): PageItem[] => {
    const maxVisiblePages = 5; // Max number of page buttons to show (excluding Prev/Next/Ellipsis)
    const pages: PageItem[] = [];

    if (totalPages <= maxVisiblePages) {
      // If few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1 and the last page
      pages.push(1);

      const sidePages = Math.floor(maxVisiblePages / 2) - 1; // 1 page away from current
      let startPage = Math.max(2, currentPage - sidePages);
      let endPage = Math.min(totalPages - 1, currentPage + sidePages);

      // Adjust start/end if we are near the boundaries
      if (currentPage < maxVisiblePages - 1) {
        endPage = maxVisiblePages - 1;
      }
      if (currentPage > totalPages - (maxVisiblePages - 1)) {
        startPage = totalPages - (maxVisiblePages - 2);
      }

      // Add left ellipsis if startPage is greater than 2
      if (startPage > 2) {
        pages.push('...');
      }

      // Add the dynamic page numbers
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add right ellipsis if endPage is less than totalPages - 1
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Only add the last page if it's not already the first element
      if (totalPages > 1 && !pages.includes(totalPages)) {
          pages.push(totalPages);
      }
    }

    // Deduplicate (safer with PageItem[])
    return pages.filter((value, index, self) => self.indexOf(value) === index);
  }, [totalPages, currentPage]);

  const visiblePages = useMemo(() => getVisiblePages(), [getVisiblePages]);

  const buttonClass = (page: PageItem): string =>
    `px-4 py-2 mx-0.5 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[40px] shadow-sm
    ${page === currentPage
      ? 'bg-blue-600 text-white shadow-blue-500/50 hover:bg-blue-700'
      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
    }`;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-end space-x-1 px-4 py-2 bg-white ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center px-4 py-2 mx-1 rounded-lg text-gray-600 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers and Ellipsis */}
      <nav className="flex items-center" aria-label="Pagination">
        {visiblePages.map((page, index) =>
          page === '...' ? (
            <span key={index+(Date.now())} className="px-4 py-2 text-gray-500 select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              // TypeScript knows 'page' is a number here
              onClick={() => onPageChange(page)}
              className={buttonClass(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </nav>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center px-4 py-2 mx-1 rounded-lg text-gray-600 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
};

export {Pagination}