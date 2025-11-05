/**
 * Stock Quote Component
 *
 * Displays stock symbol, name, and price information
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatStockPrice } from '../../utils/stockUtils';
import PriceChangeIndicator from './PriceChangeIndicator';

export default function StockQuote({
  symbol,
  name,
  price,
  change,
  changePercent,
  size = 'md',
  showName = true,
  linkToDetail = true,
  className = '',
}) {
  const sizeClasses = {
    sm: {
      symbol: 'text-sm font-semibold',
      name: 'text-xs',
      price: 'text-base font-semibold',
    },
    md: {
      symbol: 'text-base font-semibold',
      name: 'text-sm',
      price: 'text-xl font-semibold',
    },
    lg: {
      symbol: 'text-lg font-bold',
      name: 'text-base',
      price: 'text-2xl font-bold',
    },
  };

  const content = (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Left: Symbol and Name */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className={`${sizeClasses[size].symbol} text-gray-800 dark:text-gray-100`}>
            {symbol}
          </span>
          {showName && name && (
            <span className={`${sizeClasses[size].name} text-gray-500 dark:text-gray-400 truncate`}>
              {name}
            </span>
          )}
        </div>
      </div>

      {/* Right: Price and Change */}
      <div className="text-right">
        <div className={`${sizeClasses[size].price} text-gray-800 dark:text-gray-100`}>
          {formatStockPrice(price)}
        </div>
        {(change !== null || changePercent !== null) && (
          <PriceChangeIndicator
            change={change}
            changePercent={changePercent}
            size={size === 'lg' ? 'md' : 'sm'}
            showChange={true}
            showPercent={true}
          />
        )}
      </div>
    </div>
  );

  if (linkToDetail) {
    return (
      <Link
        to={`/stock/${symbol}`}
        className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg p-3 -m-3"
      >
        {content}
      </Link>
    );
  }

  return content;
}
