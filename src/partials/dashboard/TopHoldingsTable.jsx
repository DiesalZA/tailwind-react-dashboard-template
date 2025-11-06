/**
 * Top Holdings Table
 *
 * Displays top portfolio holdings with key metrics
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatValue } from '../../utils/Utils';
import PriceChangeIndicator from '../../components/stock/PriceChangeIndicator';

export default function TopHoldingsTable() {
  const { currentPortfolio, holdings, loading } = usePortfolio();

  // Calculate total portfolio value for allocation percentages
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);

  // Sort holdings by current value (descending) and take top 5
  const topHoldings = [...holdings]
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPortfolio || holdings.length === 0) {
    return (
      <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Holdings</h2>
        </header>
        <div className="p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Holdings Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add stocks to your portfolio to see them here
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium"
          >
            Go to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Holdings</h2>
        <Link
          to="/portfolio"
          className="text-sm text-violet-500 hover:text-violet-600 font-medium"
        >
          View All →
        </Link>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Symbol</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Shares</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Price</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Value</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Gain/Loss</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-right">Allocation</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {topHoldings.map((holding) => {
                const gainLoss = holding.currentValue - holding.costBasis;
                const gainLossPercent = holding.costBasis > 0
                  ? ((gainLoss / holding.costBasis) * 100)
                  : 0;
                const allocation = totalValue > 0
                  ? ((holding.currentValue / totalValue) * 100)
                  : 0;

                return (
                  <tr key={holding.id}>
                    <td className="p-2">
                      <Link
                        to={`/stock/${holding.symbol}`}
                        className="font-semibold text-violet-500 hover:text-violet-600"
                      >
                        {holding.symbol}
                      </Link>
                    </td>
                    <td className="p-2">
                      <div className="text-gray-800 dark:text-gray-100">
                        {holding.name}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-right font-medium text-gray-800 dark:text-gray-100">
                        {holding.quantity.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-right text-gray-800 dark:text-gray-100">
                        {formatValue(holding.currentPrice)}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-right font-medium text-gray-800 dark:text-gray-100">
                        {formatValue(holding.currentValue)}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-right">
                        <PriceChangeIndicator
                          change={gainLoss}
                          changePercent={gainLossPercent}
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${Math.min(allocation, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-10 text-right">
                            {allocation.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
