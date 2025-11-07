/**
 * FinancialRatios Component
 *
 * Displays calculated financial ratios organized by category
 */

import React from 'react';

export default function FinancialRatios({ symbol, ratiosData }) {
  if (!ratiosData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No ratio data available
        </p>
      </div>
    );
  }

  const ratioCategories = [
    {
      name: 'Profitability Ratios',
      description: 'Measure the company\'s ability to generate profit',
      icon: '💰',
      ratios: [
        {
          label: 'Return on Equity (ROE)',
          key: 'roe',
          format: 'percentage',
          description: 'Net Income / Shareholder Equity',
          benchmark: { good: 15, fair: 10 },
        },
        {
          label: 'Return on Assets (ROA)',
          key: 'roa',
          format: 'percentage',
          description: 'Net Income / Total Assets',
          benchmark: { good: 5, fair: 2 },
        },
        {
          label: 'Net Profit Margin',
          key: 'netMargin',
          format: 'percentage',
          description: 'Net Income / Revenue',
          benchmark: { good: 15, fair: 10 },
        },
        {
          label: 'Gross Profit Margin',
          key: 'grossMargin',
          format: 'percentage',
          description: 'Gross Profit / Revenue',
          benchmark: { good: 40, fair: 30 },
        },
        {
          label: 'Operating Margin',
          key: 'operatingMargin',
          format: 'percentage',
          description: 'Operating Income / Revenue',
          benchmark: { good: 20, fair: 15 },
        },
      ],
    },
    {
      name: 'Liquidity Ratios',
      description: 'Measure the company\'s ability to meet short-term obligations',
      icon: '💧',
      ratios: [
        {
          label: 'Current Ratio',
          key: 'currentRatio',
          format: 'ratio',
          description: 'Current Assets / Current Liabilities',
          benchmark: { good: 2, fair: 1.5 },
        },
        {
          label: 'Quick Ratio',
          key: 'quickRatio',
          format: 'ratio',
          description: '(Current Assets - Inventory) / Current Liabilities',
          benchmark: { good: 1, fair: 0.7 },
        },
        {
          label: 'Cash Ratio',
          key: 'cashRatio',
          format: 'ratio',
          description: 'Cash & Equivalents / Current Liabilities',
          benchmark: { good: 0.5, fair: 0.2 },
        },
      ],
    },
    {
      name: 'Efficiency Ratios',
      description: 'Measure how effectively the company uses its assets',
      icon: '⚡',
      ratios: [
        {
          label: 'Asset Turnover',
          key: 'assetTurnover',
          format: 'ratio',
          description: 'Revenue / Total Assets',
          benchmark: { good: 1, fair: 0.5 },
        },
        {
          label: 'Inventory Turnover',
          key: 'inventoryTurnover',
          format: 'ratio',
          description: 'Cost of Goods Sold / Average Inventory',
          benchmark: { good: 6, fair: 4 },
        },
        {
          label: 'Receivables Turnover',
          key: 'receivablesTurnover',
          format: 'ratio',
          description: 'Revenue / Average Accounts Receivable',
          benchmark: { good: 10, fair: 6 },
        },
      ],
    },
    {
      name: 'Leverage Ratios',
      description: 'Measure the company\'s debt levels and financial risk',
      icon: '⚖️',
      ratios: [
        {
          label: 'Debt-to-Equity',
          key: 'debtToEquity',
          format: 'ratio',
          description: 'Total Debt / Shareholder Equity',
          benchmark: { good: 0.5, fair: 1, inverse: true },
        },
        {
          label: 'Debt-to-Assets',
          key: 'debtToAssets',
          format: 'percentage',
          description: 'Total Debt / Total Assets',
          benchmark: { good: 30, fair: 50, inverse: true },
        },
        {
          label: 'Interest Coverage',
          key: 'interestCoverage',
          format: 'ratio',
          description: 'EBIT / Interest Expense',
          benchmark: { good: 5, fair: 2.5 },
        },
        {
          label: 'Equity Ratio',
          key: 'equityRatio',
          format: 'percentage',
          description: 'Shareholder Equity / Total Assets',
          benchmark: { good: 50, fair: 40 },
        },
      ],
    },
    {
      name: 'Valuation Ratios',
      description: 'Measure the company\'s market value relative to fundamentals',
      icon: '📊',
      ratios: [
        {
          label: 'Price-to-Earnings (P/E)',
          key: 'pe',
          format: 'ratio',
          description: 'Stock Price / Earnings Per Share',
          benchmark: { good: 15, fair: 25, inverse: true },
        },
        {
          label: 'Price-to-Book (P/B)',
          key: 'pb',
          format: 'ratio',
          description: 'Stock Price / Book Value Per Share',
          benchmark: { good: 1, fair: 3, inverse: true },
        },
        {
          label: 'Price-to-Sales (P/S)',
          key: 'ps',
          format: 'ratio',
          description: 'Market Cap / Revenue',
          benchmark: { good: 2, fair: 5, inverse: true },
        },
        {
          label: 'PEG Ratio',
          key: 'peg',
          format: 'ratio',
          description: 'P/E Ratio / Earnings Growth Rate',
          benchmark: { good: 1, fair: 2, inverse: true },
        },
        {
          label: 'Dividend Yield',
          key: 'dividendYield',
          format: 'percentage',
          description: 'Annual Dividends / Stock Price',
          benchmark: { good: 3, fair: 2 },
        },
      ],
    },
  ];

  const formatRatioValue = (value, format) => {
    if (value === null || value === undefined) return '—';

    if (format === 'percentage') {
      return `${value.toFixed(2)}%`;
    } else if (format === 'ratio') {
      return value.toFixed(2);
    }

    return value.toString();
  };

  const getRatioStatus = (value, benchmark) => {
    if (value === null || value === undefined || !benchmark) return 'neutral';

    const { good, fair, inverse } = benchmark;

    if (inverse) {
      // Lower is better (e.g., debt ratios, P/E ratio)
      if (value <= good) return 'good';
      if (value <= fair) return 'fair';
      return 'poor';
    } else {
      // Higher is better (e.g., profitability ratios)
      if (value >= good) return 'good';
      if (value >= fair) return 'fair';
      return 'poor';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'fair':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'poor':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return '✓';
      case 'fair':
        return '−';
      case 'poor':
        return '⚠';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Financial Ratios - {symbol}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Key metrics for evaluating financial health and performance
        </p>
      </div>

      {/* Ratio Categories */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700/60">
        {ratioCategories.map((category, categoryIdx) => (
          <div key={categoryIdx} className="p-6">
            {/* Category Header */}
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {category.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Ratios Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.ratios.map((ratio, ratioIdx) => {
                const value = ratiosData[ratio.key];
                const status = getRatioStatus(value, ratio.benchmark);
                const statusColor = getStatusColor(status);
                const statusIcon = getStatusIcon(status);

                return (
                  <div
                    key={ratioIdx}
                    className="border border-gray-200 dark:border-gray-700/60 rounded-lg p-4 hover:border-violet-500 dark:hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {ratio.label}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {ratio.description}
                        </p>
                      </div>
                      <span
                        className={`ml-3 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${statusColor}`}
                      >
                        <span>{statusIcon}</span>
                        <span className="capitalize">{status}</span>
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {formatRatioValue(value, ratio.format)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-700/60 rounded-b-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Status Indicators:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold">
                ✓
              </span>
              <span className="text-gray-600 dark:text-gray-400">Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 font-semibold">
                −
              </span>
              <span className="text-gray-600 dark:text-gray-400">Fair</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold">
                ⚠
              </span>
              <span className="text-gray-600 dark:text-gray-400">Poor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
