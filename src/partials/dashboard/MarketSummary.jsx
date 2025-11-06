/**
 * Market Summary
 *
 * Shows major market indices with mini trend charts
 */

import React from 'react';
import { formatValue } from '../../utils/Utils';

export default function MarketSummary() {
  // Mock market data - in production this would come from API
  const marketIndices = [
    {
      name: 'S&P 500',
      symbol: 'SPX',
      value: 4783.45,
      change: 32.18,
      changePercent: 0.68,
      trend: [4751, 4755, 4762, 4758, 4765, 4770, 4783],
    },
    {
      name: 'NASDAQ',
      symbol: 'IXIC',
      value: 15095.14,
      change: -12.35,
      changePercent: -0.08,
      trend: [15107, 15103, 15098, 15105, 15102, 15100, 15095],
    },
    {
      name: 'DOW JONES',
      symbol: 'DJI',
      value: 37305.16,
      change: 78.23,
      changePercent: 0.21,
      trend: [37227, 37240, 37255, 37265, 37280, 37290, 37305],
    },
  ];

  const renderMiniChart = (trend, isPositive) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;

    const points = trend
      .map((value, index) => {
        const x = (index / (trend.length - 1)) * 60;
        const y = 20 - ((value - min) / range) * 15;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-16 h-6" viewBox="0 0 60 20" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Market Summary</h2>
      </header>
      <div className="p-3">
        <div className="space-y-3">
          {marketIndices.map((index) => {
            const isPositive = index.change >= 0;

            return (
              <div
                key={index.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {index.symbol}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {index.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {index.value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <div className={`flex items-center text-sm font-semibold ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <svg
                        className={`w-3 h-3 mr-1 fill-current ${isPositive ? '' : 'rotate-180'}`}
                        viewBox="0 0 12 12"
                      >
                        <path d="M6 0L0 8h12L6 0z" />
                      </svg>
                      <span>
                        {isPositive ? '+' : ''}
                        {index.change.toFixed(2)}
                      </span>
                      <span className="ml-1">
                        ({isPositive ? '+' : ''}
                        {index.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {renderMiniChart(index.trend, isPositive)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
