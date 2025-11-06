/**
 * WatchlistSelector Component
 *
 * Dropdown for selecting and managing watchlists
 */

import React, { useState } from 'react';

export default function WatchlistSelector({
  watchlists = [],
  currentWatchlist,
  onSelect,
  onCreateNew,
  onDelete,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (watchlistId) => {
    onSelect(watchlistId);
    setShowDropdown(false);
  };

  const handleDelete = (e, watchlistId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this watchlist?')) {
      onDelete(watchlistId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300 min-w-48"
      >
        <span className="flex items-center justify-between w-full">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.396.198-.87-.149-.746-.592l.83-2.96-2.356-1.88c-.372-.296-.169-.882.328-.944l3.086-.392 1.228-2.85c.194-.45.845-.45 1.04 0l1.228 2.85 3.086.392c.497.062.7.648.328.944l-2.356 1.88.83 2.96c.124.443-.35.79-.746.592L8 13.187l-4.388 2.256Z" />
            </svg>
            <span className="truncate">
              {currentWatchlist?.name || 'Select Watchlist'}
            </span>
          </span>
          <svg
            className="ml-2 w-3 h-3 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </span>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setShowDropdown(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowDropdown(false);
              }
            }}
            aria-label="Close watchlist selector"
            tabIndex={-1}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg mt-1 z-20 max-h-96 overflow-y-auto">
            {/* Create new button */}
            <button
              onClick={() => {
                onCreateNew();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700/60 text-violet-500 font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 fill-current mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              Create New Watchlist
            </button>

            {/* Watchlist items */}
            {watchlists.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No watchlists yet</p>
                <p className="text-xs mt-1">Create one to get started</p>
              </div>
            ) : (
              <div className="py-1">
                {watchlists.map((watchlist) => (
                  <button
                    key={watchlist.id}
                    onClick={() => handleSelect(watchlist.id)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between group ${
                      currentWatchlist?.id === watchlist.id
                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {watchlist.name}
                      </div>
                      {watchlist.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {watchlist.description}
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, watchlist.id)}
                      className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 dark:text-red-400"
                      title="Delete watchlist"
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
