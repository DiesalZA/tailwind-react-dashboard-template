/**
 * AddStockModal Component
 *
 * Modal for adding stocks to a watchlist with search and notes
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import StockSearchBar from '../stock/StockSearchBar';
import PriceChangeIndicator from '../stock/PriceChangeIndicator';
import { formatStockPrice } from '../../utils/stockUtils';

export default function AddStockModal({ isOpen, onClose, onAdd }) {
  const [selectedStock, setSelectedStock] = useState(null);
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const triggerRef = useRef(null);

  // Store the element that opened the modal
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Focus first element when modal opens
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  // Memoize focusable elements to avoid expensive DOM queries on every keypress
  // Recalculate only when modal opens/closes or content changes
  const focusableElements = useMemo(() => {
    if (!isOpen || !modalRef.current) return [];

    const elements = modalRef.current.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    return Array.from(elements);
  }, [isOpen, selectedStock, isAdding]);

  // Focus trap
  useEffect(() => {
    const handleTab = (e) => {
      if (!isOpen || e.key !== 'Tab') return;

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, focusableElements]);

  const handleClose = () => {
    setSelectedStock(null);
    setNotes('');
    onClose();
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleAdd = async () => {
    if (!selectedStock) return;

    setIsAdding(true);
    try {
      await onAdd(selectedStock.symbol, notes);
      handleClose();
    } catch (error) {
      console.error('Failed to add stock:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-stock-modal-title"
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center justify-between">
                <h3
                  id="add-stock-modal-title"
                  className="text-lg font-semibold text-gray-800 dark:text-gray-100"
                >
                  Add Stock to Watchlist
                </h3>
                <button
                  ref={lastFocusableRef}
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search for a stock
                </label>
                <StockSearchBar
                  ref={firstFocusableRef}
                  onSelectStock={handleStockSelect}
                  placeholder="Search by symbol or company name..."
                />
              </div>

              {/* Selected stock display */}
              {selectedStock && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700/60">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold text-violet-500 dark:text-violet-400">
                          {selectedStock.symbol}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedStock.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {formatStockPrice(selectedStock.price)}
                        </span>
                        <PriceChangeIndicator
                          change={selectedStock.change}
                          changePercent={selectedStock.changePercent}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStock(null)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      aria-label="Clear selection"
                    >
                      <svg
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-4">
                <label
                  htmlFor="stock-notes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="stock-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this stock..."
                  rows={3}
                  className="form-textarea w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add any personal notes or reasons for tracking this stock
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                  disabled={isAdding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedStock || isAdding}
                  className="btn-sm bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add to Watchlist'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
