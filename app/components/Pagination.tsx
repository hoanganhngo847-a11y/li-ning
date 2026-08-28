import React from 'react';
import { cn } from '@/app/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Simple logic to show current, edges, and adjacent pages
  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && i > 1) || 
        (i === currentPage + 2 && i < totalPages)
      ) {
        pages.push('...');
      }
    }
    return pages.filter((page, index, self) => self.indexOf(page) === index);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Prev Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 rounded hover:bg-gray-50 hover:text-[#f30d29] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Pages */}
      {getPages().map((page, index) => {
        if (page === '...') {
          return <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>;
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={cn(
              "w-10 h-10 flex items-center justify-center border rounded transition-colors text-sm font-medium",
              isCurrent 
                ? "bg-[#f30d29] border-[#f30d29] text-white" 
                : "border-gray-200 text-gray-600 hover:border-[#f30d29] hover:text-[#f30d29]"
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 rounded hover:bg-gray-50 hover:text-[#f30d29] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
