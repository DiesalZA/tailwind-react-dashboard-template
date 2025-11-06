/**
 * Recent Activity
 *
 * Shows recent portfolio transactions
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatValue } from '../../utils/Utils';

export default function RecentActivity() {
  const { currentPortfolio, transactions, loading } = usePortfolio();

  // Get recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPortfolio || transactions.length === 0) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
        </header>
        <div className="p-8 text-center">
          <svg
            className="w-10 h-10 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            No transactions yet
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-xs font-medium"
          >
            Go to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
          <Link
            to="/portfolio"
            className="text-xs text-violet-500 hover:text-violet-600 font-medium"
          >
            View All →
          </Link>
        </div>
      </header>
      <div className="p-3">
        <ul className="space-y-1">
          {recentTransactions.map((transaction) => {
            const isBuy = transaction.type.toLowerCase() === 'buy';

            return (
              <li key={transaction.id} className="flex px-2">
                <div
                  className={`w-9 h-9 rounded-full shrink-0 my-2 mr-3 flex items-center justify-center ${
                    isBuy
                      ? 'bg-green-500'
                      : transaction.type.toLowerCase() === 'sell'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {isBuy ? (
                    <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 20 20">
                      <path d="M10 5l-7 7h4v6h6v-6h4l-7-7z" />
                    </svg>
                  ) : transaction.type.toLowerCase() === 'sell' ? (
                    <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 20 20">
                      <path d="M10 15l7-7h-4V2H7v6H3l7 7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v2h2V7zm0 4H9v6h2v-6z" />
                    </svg>
                  )}
                </div>
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                  <div className="grow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-1 sm:mb-0">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {transaction.type}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <Link
                        to={`/stock/${transaction.symbol}`}
                        className="font-semibold text-violet-500 hover:text-violet-600"
                      >
                        {transaction.symbol}
                      </Link>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {transaction.quantity} shares @ {formatValue(transaction.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${
                        isBuy ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {isBuy ? '-' : '+'}{formatValue(transaction.total)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-16 text-right">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
