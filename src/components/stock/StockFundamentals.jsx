/**
 * Stock Fundamentals Component
 *
 * Displays company fundamentals and financial metrics
 */

import React from 'react';
import { formatMarketCap, formatRatio, formatPercent } from '../../utils/stockUtils';

export default function StockFundamentals({ fundamentals, className = '' }) {
  if (!fundamentals) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading fundamentals...
        </div>
      </div>
    );
  }

  const companyInfo = [
    { label: 'CEO', value: fundamentals.ceo },
    { label: 'Employees', value: fundamentals.employees?.toLocaleString() },
    { label: 'Sector', value: fundamentals.sector },
    { label: 'Industry', value: fundamentals.industry },
  ];

  const valuationMetrics = [
    { label: 'Market Cap', value: fundamentals.marketCap ? formatMarketCap(fundamentals.marketCap) : 'N/A' },
    { label: 'P/E Ratio', value: fundamentals.peRatio ? formatRatio(fundamentals.peRatio) : 'N/A' },
    { label: 'PEG Ratio', value: fundamentals.pegRatio ? formatRatio(fundamentals.pegRatio) : 'N/A' },
    { label: 'P/B Ratio', value: fundamentals.pbRatio ? formatRatio(fundamentals.pbRatio) : 'N/A' },
    { label: 'Price/Sales', value: fundamentals.priceToSales ? formatRatio(fundamentals.priceToSales) : 'N/A' },
    { label: 'Dividend Yield', value: fundamentals.dividendYield ? `${fundamentals.dividendYield.toFixed(2)}%` : 'N/A' },
  ];

  const financialMetrics = [
    { label: 'Revenue', value: fundamentals.revenue ? formatMarketCap(fundamentals.revenue) : 'N/A' },
    { label: 'Revenue Growth', value: fundamentals.revenueGrowth ? formatPercent(fundamentals.revenueGrowth, false) : 'N/A' },
    { label: 'Net Income', value: fundamentals.netIncome ? formatMarketCap(fundamentals.netIncome) : 'N/A' },
    { label: 'Profit Margin', value: fundamentals.profitMargin ? `${fundamentals.profitMargin.toFixed(2)}%` : 'N/A' },
    { label: 'Operating Margin', value: fundamentals.operatingMargin ? `${fundamentals.operatingMargin.toFixed(2)}%` : 'N/A' },
    { label: 'ROE', value: fundamentals.returnOnEquity ? `${fundamentals.returnOnEquity.toFixed(2)}%` : 'N/A' },
    { label: 'ROA', value: fundamentals.returnOnAssets ? `${fundamentals.returnOnAssets.toFixed(2)}%` : 'N/A' },
    { label: 'Beta', value: fundamentals.beta ? formatRatio(fundamentals.beta) : 'N/A' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Company Description */}
      {fundamentals.description && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            About {fundamentals.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {fundamentals.description}
          </p>
          {fundamentals.website && (
            <a
              href={fundamentals.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
            >
              Visit Website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Company Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Company Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {companyInfo.map((item, index) => (
            <div key={index}>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {item.value || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Valuation Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {valuationMetrics.map((item, index) => (
            <div key={index}>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Financial Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {financialMetrics.map((item, index) => (
            <div key={index}>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
