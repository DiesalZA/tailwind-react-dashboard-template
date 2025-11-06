/**
 * WatchlistStocks Component
 *
 * Displays stocks in the current watchlist with prices and actions
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PriceChangeIndicator from '../stock/PriceChangeIndicator';
import { formatStockPrice } from '../../utils/stockUtils';

export default function WatchlistStocks({ stocks = [], loading = false, onRemove, onUpdateNotes }) {
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');

  const handleStartEditNotes = (stock) => {
    setEditingNotes(stock.symbol);
    setNotesText(stock.notes || '');
  };

  const handleSaveNotes = (symbol) => {
    onUpdateNotes(symbol, notesText);
    setEditingNotes(null);
    setNotesText('');
  };

  const handleCancelNotes = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Loading watchlist...
          </p>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Stocks in Watchlist
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add stocks to start tracking your favorites
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Stocks ({stocks.length})
        </h2>
      </div>

      {/* Stocks list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700/60">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="p-5 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Stock info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="text-lg font-semibold text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500"
                    >
                      {stock.symbol}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {stock.name}
                    </p>

                    {/* Price and change */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {formatStockPrice(stock.price)}
                      </span>
                      <PriceChangeIndicator
                        change={stock.change}
                        changePercent={stock.changePercent}
                      />
                    </div>

                    {/* Notes */}
                    {editingNotes === stock.symbol ? (
                      <div className="mt-3">
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          placeholder="Add notes about this stock..."
                          rows={2}
                          className="form-textarea w-full text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveNotes(stock.symbol)}
                            className="btn-xs bg-violet-500 hover:bg-violet-600 text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelNotes}
                            className="btn-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : stock.notes ? (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-start justify-between gap-2">
                          <p className="flex-1">{stock.notes}</p>
                          <button
                            onClick={() => handleStartEditNotes(stock)}
                            className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500 flex-shrink-0"
                            title="Edit notes"
                          >
                            <svg
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditNotes(stock)}
                        className="mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400"
                      >
                        + Add notes
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link
                  to={`/stock/${stock.symbol}`}
                  className="btn-xs bg-violet-500 hover:bg-violet-600 text-white whitespace-nowrap"
                >
                  View Details
                </Link>
                <button
                  onClick={() => onRemove(stock.symbol)}
                  className="btn-xs border-red-200 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600 text-red-600 dark:text-red-400 whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Added date */}
            <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Added {new Date(stock.addedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
