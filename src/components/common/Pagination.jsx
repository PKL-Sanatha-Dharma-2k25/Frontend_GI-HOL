import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {},
  showInfo = true,
  itemsPerPage = 10,
  totalItems = 0
}) {
  const [jumpToPage, setJumpToPage] = useState('');

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4">
      {/* Info Text */}
      {showInfo && totalItems > 0 && (
        <div className="text-sm text-gray-600 font-medium">
          Showing <span className="text-blue-600 font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-blue-600 font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-blue-600 font-semibold">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          onKeyDown={handleKeyDown}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
          title="First page"
        >
          <ChevronsLeft size={18} className="transition-transform group-hover:scale-110" />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          onKeyDown={handleKeyDown}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
          title="Previous page"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:scale-110" />
        </button>

        {/* First Page Number */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-gray-400 font-medium">•••</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            onKeyDown={handleKeyDown}
            className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium group ${
              currentPage === page
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-0'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page Number */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-400 font-medium">•••</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          onKeyDown={handleKeyDown}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
          title="Next page"
        >
          <ChevronRight size={18} className="transition-transform group-hover:scale-110" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          onKeyDown={handleKeyDown}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
          title="Last page"
        >
          <ChevronsRight size={18} className="transition-transform group-hover:scale-110" />
        </button>

        {/* Jump to Page */}
        <form onSubmit={handleJumpToPage} className="ml-auto flex items-center gap-2">
          <label htmlFor="jumpToPage" className="text-sm text-gray-600 font-medium">
            Go to:
          </label>
          <input
            id="jumpToPage"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Page"
            className="w-14 px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
          <button
            type="submit"
            disabled={!jumpToPage}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go
          </button>
        </form>
      </div>

      {/* Page Info */}
      {totalPages > 0 && (
        <div className="text-xs text-gray-500 font-medium">
          Page <span className="text-blue-600 font-semibold">{currentPage}</span> of <span className="text-blue-600 font-semibold">{totalPages}</span>
          {totalItems > 0 && ` • Total: ${totalItems} items`}
        </div>
      )}
    </div>
  );
}