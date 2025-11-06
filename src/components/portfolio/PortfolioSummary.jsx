/**
 * Portfolio Summary Component
 *
 * Displays key portfolio metrics and statistics
 */

import React from 'react';
import { formatStockPrice, formatPercent, getChangeColor } from '../../utils/stockUtils';
import { PriceChangeIndicator } from '../stock';

export default function PortfolioSummary({ portfolio, className = '' }) {
  if (!portfolio) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Value',
      value: formatStockPrice(portfolio.totalValue),
      subValue: portfolio.cashBalance > 0 ? `Cash: ${formatStockPrice(portfolio.cashBalance)}` : null,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Gain/Loss',
      value: formatStockPrice(Math.abs(portfolio.totalGainLoss)),
      subValue: formatPercent(portfolio.totalGainLossPercent),
      valueColor: getChangeColor(portfolio.totalGainLoss),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Today's Change",
      value: formatStockPrice(Math.abs(portfolio.dayChange)),
      subValue: formatPercent(portfolio.dayChangePercent),
      valueColor: getChangeColor(portfolio.dayChange),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Cost Basis',
      value: formatStockPrice(portfolio.totalCost),
      subValue: null,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric.label}
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              {metric.icon}
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${metric.valueColor || 'text-gray-800 dark:text-gray-100'}`}>
            {metric.value}
          </div>
          {metric.subValue && (
            <div className={`text-sm ${metric.valueColor || 'text-gray-500 dark:text-gray-400'}`}>
              {metric.subValue}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
