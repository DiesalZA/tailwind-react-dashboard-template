/**
 * Transaction History Component
 *
 * Displays portfolio transaction history
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatStockPrice } from '../../utils/stockUtils';
import { TRANSACTION_TYPES } from '../../types/portfolio';

export default function TransactionHistory({ transactions = [], loading = false, className = '' }) {
  const getTransactionIcon = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.BUY:
        return (
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case TRANSACTION_TYPES.SELL:
        return (
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case TRANSACTION_TYPES.DIVIDEND:
        return (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.BUY:
        return 'text-green-600 dark:text-green-400';
      case TRANSACTION_TYPES.SELL:
        return 'text-red-600 dark:text-red-400';
      case TRANSACTION_TYPES.DIVIDEND:
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Recent Transactions
        </h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No transactions yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Icon */}
            {getTransactionIcon(transaction.type)}

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <Link
                  to={`/stock/${transaction.symbol}`}
                  className="font-semibold text-gray-800 dark:text-gray-100 hover:text-violet-500 dark:hover:text-violet-400"
                >
                  {transaction.symbol}
                </Link>
                <span className={`text-xs font-medium uppercase ${getTransactionColor(transaction.type)}`}>
                  {transaction.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{transaction.shares.toLocaleString()} shares</span>
                <span>•</span>
                <span>@{formatStockPrice(transaction.price)}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                {transaction.type === TRANSACTION_TYPES.SELL || transaction.type === TRANSACTION_TYPES.DIVIDEND ? '+' : '-'}
                {formatStockPrice(transaction.amount)}
              </div>
              {transaction.fees > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Fee: {formatStockPrice(transaction.fees)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
