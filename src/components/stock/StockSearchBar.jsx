/**
 * Stock Search Bar
 *
 * Autocomplete search for stocks
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockService } from '../../services';
import Transition from '../../utils/Transition';

export default function StockSearchBar({ placeholder = 'Search stocks...', className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search for stocks
  useEffect(() => {
    const searchStocks = async () => {
      if (query.trim().length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      const response = await stockService.search(query, 10);

      if (response.success) {
        setResults(response.data.results || response.data || []);
        setShowResults(true);
      } else {
        setResults([]);
      }

      setLoading(false);
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          selectStock(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
      default:
        break;
    }
  };

  // Select stock and navigate
  const selectStock = (stock) => {
    navigate(`/stock/${stock.symbol}`);
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="form-input w-full pl-10"
        />
        {/* Search Icon */}
        <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 ml-3"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
          </svg>
        </div>
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 left-auto flex items-center pr-3">
            <svg
              className="animate-spin w-4 h-4 fill-current text-gray-400"
              viewBox="0 0 16 16"
            >
              <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      <Transition
        show={showResults && results.length > 0}
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((stock, index) => (
            <button
              key={stock.symbol}
              onClick={() => selectStock(stock)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700/50' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === results.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-200 dark:border-gray-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {stock.name}
                  </div>
                </div>
                {stock.exchange && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {stock.exchange}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Transition>

      {/* No Results */}
      {showResults && !loading && results.length === 0 && query.trim().length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg px-4 py-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No stocks found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
