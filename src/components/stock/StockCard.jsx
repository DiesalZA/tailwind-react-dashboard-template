/**
 * Stock Card Component
 *
 * Displays stock information in a compact card format
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatStockPrice, formatVolume, formatMarketCap } from '../../utils/stockUtils';
import PriceChangeIndicator from './PriceChangeIndicator';

export default function StockCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  marketCap,
  showVolume = false,
  showMarketCap = false,
  className = '',
}) {
  return (
    <Link
      to={`/stock/${symbol}`}
      className={`block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 hover:border-violet-500 dark:hover:border-violet-500 transition-colors p-4 ${className}`}
    >
      {/* Header: Symbol and Change */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {symbol}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {name}
          </p>
        </div>
        <PriceChangeIndicator
          changePercent={changePercent}
          showChange={false}
          showPercent={true}
          size="sm"
        />
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatStockPrice(price)}
        </div>
        {change !== null && change !== undefined && (
          <PriceChangeIndicator
            change={change}
            showChange={true}
            showPercent={false}
            showIcon={true}
            size="sm"
          />
        )}
      </div>

      {/* Additional Info */}
      {(showVolume || showMarketCap) && (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {showVolume && volume !== null && volume !== undefined && (
            <div>
              <span className="font-medium">Vol:</span> {formatVolume(volume)}
            </div>
          )}
          {showMarketCap && marketCap !== null && marketCap !== undefined && (
            <div>
              <span className="font-medium">MCap:</span> {formatMarketCap(marketCap)}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
