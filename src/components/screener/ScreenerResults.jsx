/**
 * ScreenerResults Component
 *
 * Displays stock screening results in a sortable table
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatStockPrice, formatMarketCap, formatVolume } from '../../utils/stockUtils';
import PriceChangeIndicator from '../stock/PriceChangeIndicator';

export default function ScreenerResults({ results = [], loading = false, onAddToWatchlist }) {
  const [sortField, setSortField] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle nested values
    if (sortField === 'change') {
      aVal = a.change?.percent || 0;
      bVal = b.change?.percent || 0;
    }

    // Handle null/undefined
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Numeric comparison
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // String comparison
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (sortDirection === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return bStr < aStr ? -1 : bStr > aStr ? 1 : 0;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 fill-current text-gray-400" viewBox="0 0 12 12">
          <path d="M6 0l4 4H2zM6 12l4-4H2z" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 fill-current text-violet-500" viewBox="0 0 12 12">
        <path d="M6 0l4 4H2z" />
      </svg>
    ) : (
      <svg className="w-3 h-3 fill-current text-violet-500" viewBox="0 0 12 12">
        <path d="M6 12l4-4H2z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Searching stocks...
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more results
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
          Results ({results.length})
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700/60">
          {/* Table header */}
          <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700/60">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-left w-full"
                  onClick={() => handleSort('symbol')}
                >
                  <span>Symbol</span>
                  <SortIcon field="symbol" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-left w-full"
                  onClick={() => handleSort('name')}
                >
                  <span>Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('price')}
                >
                  <span className="ml-auto">Price</span>
                  <SortIcon field="price" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('change')}
                >
                  <span className="ml-auto">Change</span>
                  <SortIcon field="change" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('volume')}
                >
                  <span className="ml-auto">Volume</span>
                  <SortIcon field="volume" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('marketCap')}
                >
                  <span className="ml-auto">Market Cap</span>
                  <SortIcon field="marketCap" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('pe')}
                >
                  <span className="ml-auto">P/E</span>
                  <SortIcon field="pe" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <button
                  className="flex items-center font-semibold text-right w-full"
                  onClick={() => handleSort('dividendYield')}
                >
                  <span className="ml-auto">Yield</span>
                  <SortIcon field="dividendYield" />
                </button>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <span className="font-semibold text-right">Actions</span>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700/60">
            {sortedResults.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                <td className="px-5 py-3 whitespace-nowrap">
                  <Link
                    to={`/stock/${stock.symbol}`}
                    className="font-medium text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500"
                  >
                    {stock.symbol}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <div className="text-gray-800 dark:text-gray-100 max-w-xs truncate">
                    {stock.name}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {formatStockPrice(stock.price)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <PriceChangeIndicator
                    change={stock.change?.value}
                    changePercent={stock.change?.percent}
                  />
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <div className="text-gray-600 dark:text-gray-400">
                    {formatVolume(stock.volume)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <div className="text-gray-600 dark:text-gray-400">
                    {formatMarketCap(stock.marketCap)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <div className="text-gray-600 dark:text-gray-400">
                    {stock.pe ? stock.pe.toFixed(2) : '—'}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <div className="text-gray-600 dark:text-gray-400">
                    {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '—'}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => onAddToWatchlist?.(stock.symbol)}
                    className="text-gray-400 hover:text-violet-500 dark:hover:text-violet-400"
                    title="Add to Watchlist"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.612 15.443c-.396.198-.87-.149-.746-.592l.83-2.96-2.356-1.88c-.372-.296-.169-.882.328-.944l3.086-.392 1.228-2.85c.194-.45.845-.45 1.04 0l1.228 2.85 3.086.392c.497.062.7.648.328.944l-2.356 1.88.83 2.96c.124.443-.35.79-.746.592L8 13.187l-4.388 2.256Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
