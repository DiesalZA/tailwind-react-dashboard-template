/**
 * Holdings Table Component
 *
 * Displays portfolio holdings in a sortable table
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatStockPrice, formatPercent, getChangeColor } from '../../utils/stockUtils';
import { PriceChangeIndicator } from '../stock';

export default function HoldingsTable({ holdings = [], loading = false, className = '' }) {
  const [sortField, setSortField] = useState('currentValue'); // Default sort by value
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle null/undefined
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Holdings Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your first transaction to start tracking your portfolio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700/60">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('symbol')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                >
                  Symbol
                  <SortIcon field="symbol" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('shares')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Shares
                  <SortIcon field="shares" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('avgCost')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Avg Cost
                  <SortIcon field="avgCost" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Price
                  <SortIcon field="currentPrice" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('currentValue')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Value
                  <SortIcon field="currentValue" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('gainLoss')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Gain/Loss
                  <SortIcon field="gainLoss" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('allocation')}
                  className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Allocation
                  <SortIcon field="allocation" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700/60">
            {sortedHoldings.map((holding) => (
              <tr key={holding.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-4">
                  <Link
                    to={`/stock/${holding.symbol}`}
                    className="block hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {holding.symbol}
                    </div>
                    {holding.name && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {holding.name}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-800 dark:text-gray-100">
                  {holding.shares.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-800 dark:text-gray-100">
                  {formatStockPrice(holding.avgCost)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {formatStockPrice(holding.currentPrice)}
                  </div>
                  {holding.dayChangePercent !== null && (
                    <PriceChangeIndicator
                      changePercent={holding.dayChangePercent}
                      showChange={false}
                      showPercent={true}
                      size="sm"
                    />
                  )}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-gray-800 dark:text-gray-100">
                  {formatStockPrice(holding.currentValue)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className={`text-sm font-medium ${getChangeColor(holding.gainLoss)}`}>
                    {formatStockPrice(Math.abs(holding.gainLoss))}
                  </div>
                  <div className={`text-xs ${getChangeColor(holding.gainLoss)}`}>
                    {formatPercent(holding.gainLossPercent)}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="text-sm text-gray-800 dark:text-gray-100">
                      {formatPercent(holding.allocation, false)}
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full"
                        style={{ width: `${Math.min(holding.allocation, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
