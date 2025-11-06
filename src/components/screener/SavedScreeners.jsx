/**
 * SavedScreeners Component
 *
 * Manages saved screener configurations
 */

import React, { useState, useEffect, useRef } from 'react';

export default function SavedScreeners({ savedScreeners = [], onLoad, onDelete, onSave, currentFilters }) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [screenName, setScreenName] = useState('');
  const [screenDescription, setScreenDescription] = useState('');

  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const handleSave = () => {
    if (!screenName.trim()) return;

    onSave({
      name: screenName,
      description: screenDescription,
      filters: currentFilters,
      createdAt: new Date().toISOString(),
    });

    setScreenName('');
    setScreenDescription('');
    closeModal();
  };

  const closeModal = () => {
    setShowSaveModal(false);
    // Return focus to trigger button
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const getFilterSummary = (filters) => {
    const parts = [];

    if (filters.priceMin || filters.priceMax) {
      parts.push(`Price: $${filters.priceMin || '0'}-${filters.priceMax || '∞'}`);
    }
    if (filters.marketCap?.length) {
      parts.push(`${filters.marketCap.length} cap type${filters.marketCap.length > 1 ? 's' : ''}`);
    }
    if (filters.sectors?.length) {
      parts.push(`${filters.sectors.length} sector${filters.sectors.length > 1 ? 's' : ''}`);
    }
    if (filters.volumeMin) {
      parts.push(`Vol > ${filters.volumeMin}`);
    }
    if (filters.peMin || filters.peMax) {
      parts.push(`P/E: ${filters.peMin || '0'}-${filters.peMax || '∞'}`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
  };

  // ESC key handler to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showSaveModal) {
        closeModal();
        setScreenName('');
        setScreenDescription('');
      }
    };

    if (showSaveModal) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showSaveModal]);

  // Focus trap and initial focus
  useEffect(() => {
    if (!showSaveModal || !modalRef.current) return;

    // Focus first input when modal opens
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    // Get all focusable elements in the modal
    const getFocusableElements = () => {
      return modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    // Focus trap handler
    const handleTabKey = (e) => {
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab: if focused on first element, move to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if focused on last element, move to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [showSaveModal]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Saved Screens
          </h2>
          <button
            ref={triggerRef}
            onClick={() => setShowSaveModal(true)}
            className="text-sm text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500 font-medium"
            aria-haspopup="dialog"
          >
            + Save Current
          </button>
        </div>
      </div>

      {/* Saved screeners list */}
      <div className="p-5">
        {savedScreeners.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No saved screens yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedScreeners.map((screen, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700/60 rounded-lg p-4 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">
                      {screen.name}
                    </h3>
                    {screen.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {screen.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getFilterSummary(screen.filters)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => onLoad(screen.filters)}
                      className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500"
                      title="Load"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(screen.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              closeModal();
              setScreenName('');
              setScreenDescription('');
            }
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-screen-modal-title"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h3
              id="save-screen-modal-title"
              className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Save Screen
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                  Screen Name *
                </label>
                <input
                  ref={firstFocusableRef}
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && screenName.trim()) {
                      handleSave();
                    }
                  }}
                  placeholder="e.g., High Dividend Tech Stocks"
                  className="form-input w-full"
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={screenDescription}
                  onChange={(e) => setScreenDescription(e.target.value)}
                  placeholder="Brief description of this screen..."
                  rows={3}
                  className="form-textarea w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  closeModal();
                  setScreenName('');
                  setScreenDescription('');
                }}
                className="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!screenName.trim()}
                aria-disabled={!screenName.trim()}
                className="btn bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Save Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
