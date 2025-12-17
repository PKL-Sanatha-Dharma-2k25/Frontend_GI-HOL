import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
  showInfo = true,
  itemsPerPage = 10,
  totalItems = 0
}) {
  const [jumpToPage, setJumpToPage] = useState('');
  const itemsPerPageOptions = [5, 10, 15, 20, 50];

  const getPageNumbers = useCallback(() => {
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
  }, [currentPage, totalPages]);

  const handleJumpToPage = useCallback((e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  }, [jumpToPage, totalPages, onPageChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const PaginationButton = ({ onClick, disabled, icon: Icon, title, children, isActive = false, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      title={title}
      className={`
        relative px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm
        flex items-center justify-center
        ${disabled 
          ? 'opacity-30 cursor-not-allowed' 
          : 'hover:shadow-md active:scale-95 cursor-pointer'
        }
        ${isActive
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
          : 'bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'
        }
        ${className}
      `}
    >
      {Icon ? (
        <Icon size={18} className="transition-transform duration-300" />
      ) : (
        children
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Top Info Section */}
      {showInfo && totalItems > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Showing</span>
              <span className="mx-2 text-blue-600 font-bold">{startItem}</span>
              <span className="text-gray-600">to</span>
              <span className="mx-2 text-blue-600 font-bold">{endItem}</span>
              <span className="text-gray-600">of</span>
              <span className="mx-2 text-blue-600 font-bold">{totalItems}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <label className="text-sm text-gray-700 font-medium whitespace-nowrap">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(parseInt(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        
        {/* First & Previous Buttons */}
        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            icon={ChevronsLeft}
            title="First page"
          />
          <PaginationButton
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            icon={ChevronLeft}
            title="Previous page"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <PaginationButton
                onClick={() => onPageChange(1)}
                className="min-w-[36px]"
              >
                1
              </PaginationButton>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-400 text-sm">···</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
              className="min-w-[36px]"
            >
              {page}
            </PaginationButton>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-400 text-sm">···</span>
              )}
              <PaginationButton
                onClick={() => onPageChange(totalPages)}
                className="min-w-[36px]"
              >
                {totalPages}
              </PaginationButton>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* Next & Last Buttons */}
        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            icon={ChevronRight}
            title="Next page"
          />
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            icon={ChevronsRight}
            title="Last page"
          />
        </div>

        {/* Jump to Page */}
        <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
          <label htmlFor="jumpToPage" className="text-sm text-gray-700 font-medium whitespace-nowrap">
            Jump to:
          </label>
          <input
            id="jumpToPage"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJumpToPage(e);
              else handleKeyDown(e);
            }}
            placeholder="Page"
            className="w-12 px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          <button
            onClick={handleJumpToPage}
            disabled={!jumpToPage}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
          >
            Go
          </button>
        </div>
      </div>

      {/* Footer Info */}
      {totalPages > 0 && (
        <div className="text-xs text-gray-600 font-medium flex justify-between items-center px-2">
          <div>
            Page <span className="text-blue-600 font-bold text-sm">{currentPage}</span> of <span className="text-blue-600 font-bold text-sm">{totalPages}</span>
          </div>
          <div className="text-gray-400 text-xs">
            Use ← → keys to navigate
          </div>
        </div>
      )}
    </div>
  );
}