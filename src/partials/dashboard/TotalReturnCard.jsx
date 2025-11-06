/**
 * Total Return Card
 *
 * Displays overall portfolio return since inception
 */

import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatValue } from '../../utils/Utils';

export default function TotalReturnCard() {
  const { currentPortfolio, holdings, loading } = usePortfolio();

  // Calculate total cost basis and current value
  const totalCost = holdings.reduce((sum, holding) => sum + holding.costBasis, 0);
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);

  // Calculate total return
  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? ((totalReturn / totalCost) * 100) : 0;

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
              Total Return
            </h3>
          </header>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            No portfolio selected
          </div>
        </div>
      </div>
    );
  }

  const isPositive = totalReturn >= 0;

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 py-5">
        <header className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Total Return
          </h3>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            isPositive
              ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%
          </div>
        </header>
        <div className="flex items-start">
          <div className={`text-3xl font-bold mr-2 ${
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{formatValue(totalReturn)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Cost basis: {formatValue(totalCost)}
          </div>
          <div className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <svg
              className={`w-3 h-3 mr-1 fill-current ${isPositive ? '' : 'rotate-180'}`}
              viewBox="0 0 12 12"
            >
              <path d="M6 0L0 8h12L6 0z" />
            </svg>
            {formatValue(Math.abs(totalReturn))}
          </div>
        </div>
      </div>
    </div>
  );
}
