/**
 * Stock Stats Component
 *
 * Displays key stock statistics in a grid layout
 */

import React from 'react';
import { formatStockPrice, formatVolume, formatMarketCap, formatRatio, formatPercent } from '../../utils/stockUtils';

export default function StockStats({ quote, className = '' }) {
  if (!quote) return null;

  const stats = [
    {
      label: 'Open',
      value: quote.open !== null ? formatStockPrice(quote.open) : 'N/A',
    },
    {
      label: 'High',
      value: quote.high !== null ? formatStockPrice(quote.high) : 'N/A',
    },
    {
      label: 'Low',
      value: quote.low !== null ? formatStockPrice(quote.low) : 'N/A',
    },
    {
      label: 'Prev Close',
      value: quote.previousClose !== null ? formatStockPrice(quote.previousClose) : 'N/A',
    },
    {
      label: 'Volume',
      value: quote.volume !== null ? formatVolume(quote.volume) : 'N/A',
    },
    {
      label: 'Avg Volume',
      value: quote.avgVolume !== null ? formatVolume(quote.avgVolume) : 'N/A',
    },
    {
      label: 'Market Cap',
      value: quote.marketCap !== null ? formatMarketCap(quote.marketCap) : 'N/A',
    },
    {
      label: 'P/E Ratio',
      value: quote.peRatio !== null ? formatRatio(quote.peRatio) : 'N/A',
    },
    {
      label: 'EPS',
      value: quote.eps !== null ? `$${quote.eps.toFixed(2)}` : 'N/A',
    },
    {
      label: '52W High',
      value: quote.week52High !== null ? formatStockPrice(quote.week52High) : 'N/A',
    },
    {
      label: '52W Low',
      value: quote.week52Low !== null ? formatStockPrice(quote.week52Low) : 'N/A',
    },
    {
      label: '52W Range',
      value: quote.week52Low !== null && quote.week52High !== null
        ? `${formatStockPrice(quote.week52Low)} - ${formatStockPrice(quote.week52High)}`
        : 'N/A',
      span: true,
    },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Key Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.span ? 'col-span-2 md:col-span-3 lg:col-span-4' : ''}`}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
