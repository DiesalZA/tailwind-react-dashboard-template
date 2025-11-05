/**
 * Price Change Indicator
 *
 * Displays price change with color-coded styling
 */

import React from 'react';
import { formatChange, formatPercent, getChangeColor } from '../../utils/stockUtils';

export default function PriceChangeIndicator({
  change,
  changePercent,
  showChange = true,
  showPercent = true,
  showIcon = true,
  size = 'md',
  className = '',
}) {
  const colorClass = getChangeColor(change || changePercent);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    const value = change || changePercent;
    if (value === 0 || value === null || value === undefined) return null;

    if (value > 0) {
      return (
        <svg
          className={`${iconSizeClasses[size]} ${colorClass} inline-block`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className={`${iconSizeClasses[size]} ${colorClass} inline-block`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} ${sizeClasses[size]} font-medium ${className}`}>
      {renderIcon()}
      {showChange && change !== null && change !== undefined && (
        <span>{formatChange(change)}</span>
      )}
      {showChange && showPercent && change !== null && changePercent !== null && (
        <span>•</span>
      )}
      {showPercent && changePercent !== null && changePercent !== undefined && (
        <span>{formatPercent(changePercent)}</span>
      )}
    </span>
  );
}
