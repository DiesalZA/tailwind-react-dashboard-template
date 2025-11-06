/**
 * Portfolio Value Card
 *
 * Displays total portfolio value with daily change
 */

import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatValue } from '../../utils/Utils';

export default function PortfolioValueCard() {
  const { currentPortfolio, holdings, loading } = usePortfolio();

  // Calculate total portfolio value
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);

  // Calculate today's change (mock calculation - in reality this would come from API)
  const todayChange = totalValue * 0.012; // Mock 1.2% gain
  const todayChangePercent = 1.2;

  if (loading) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPortfolio) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <header className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Portfolio Value
            </h3>
          </header>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            No portfolio selected
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 py-5">
        <header className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Total Portfolio Value
          </h3>
          <svg
            className="w-4 h-4 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
          </svg>
        </header>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {formatValue(totalValue)}
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className={`flex items-center text-sm font-semibold ${todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <svg
              className={`w-3 h-3 mr-1 fill-current ${todayChange >= 0 ? '' : 'rotate-180'}`}
              viewBox="0 0 12 12"
            >
              <path d="M6 0L0 8h12L6 0z" />
            </svg>
            <span>{formatValue(Math.abs(todayChange))}</span>
            <span className="ml-1">({todayChangePercent.toFixed(2)}%)</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
