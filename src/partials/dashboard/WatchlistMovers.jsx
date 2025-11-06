/**
 * Watchlist Movers
 *
 * Shows top gainers and losers from watchlists
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import { formatStockPrice } from '../../utils/stockUtils';
import PriceChangeIndicator from '../../components/stock/PriceChangeIndicator';

export default function WatchlistMovers() {
  const { items, loading } = useWatchlist();
  const [view, setView] = useState('gainers'); // 'gainers' or 'losers'

  // Sort by change percent
  const sortedStocks = [...items].sort((a, b) => {
    if (view === 'gainers') {
      return (b.changePercent || 0) - (a.changePercent || 0);
    } else {
      return (a.changePercent || 0) - (b.changePercent || 0);
    }
  });

  // Take top 5
  const topMovers = sortedStocks.slice(0, 5);

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Watchlist Movers</h2>
        </header>
        <div className="p-8 text-center">
          <svg
            className="w-10 h-10 text-gray-400 mx-auto mb-3"
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            No stocks in watchlist
          </p>
          <Link
            to="/watchlist"
            className="inline-flex items-center px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-xs font-medium"
          >
            Add Stocks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Watchlist Movers</h2>
          <Link
            to="/watchlist"
            className="text-xs text-violet-500 hover:text-violet-600 font-medium"
          >
            View All →
          </Link>
        </div>
        {/* Toggle */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setView('gainers')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              view === 'gainers'
                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setView('losers')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              view === 'losers'
                ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            Top Losers
          </button>
        </div>
      </header>
      <div className="p-3">
        {/* List */}
        <ul className="space-y-2">
          {topMovers.map((stock) => (
            <li key={stock.id}>
              <Link
                to={`/stock/${stock.symbol}`}
                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-violet-500 dark:text-violet-400">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stock.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {formatStockPrice(stock.price)}
                      </span>
                      <PriceChangeIndicator
                        change={stock.change}
                        changePercent={stock.changePercent}
                        size="sm"
                      />
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {topMovers.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            No {view === 'gainers' ? 'gainers' : 'losers'} to display
          </div>
        )}
      </div>
    </div>
  );
}
