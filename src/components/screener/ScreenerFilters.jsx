/**
 * ScreenerFilters Component
 *
 * Filter controls for the stock screener
 */

import React from 'react';

const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Industrials',
  'Energy',
  'Consumer Defensive',
  'Real Estate',
  'Utilities',
  'Communication Services',
  'Basic Materials',
];

const MARKET_CAP_OPTIONS = [
  { value: 'mega', label: 'Mega Cap (>$200B)', min: 200000000000 },
  { value: 'large', label: 'Large Cap ($10B-$200B)', min: 10000000000, max: 200000000000 },
  { value: 'mid', label: 'Mid Cap ($2B-$10B)', min: 2000000000, max: 10000000000 },
  { value: 'small', label: 'Small Cap ($300M-$2B)', min: 300000000, max: 2000000000 },
  { value: 'micro', label: 'Micro Cap (<$300M)', max: 300000000 },
];

export default function ScreenerFilters({ filters, onFilterChange, onReset, onSearch }) {
  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleMarketCapToggle = (capType) => {
    const selectedCaps = filters.marketCap || [];
    const newCaps = selectedCaps.includes(capType)
      ? selectedCaps.filter(c => c !== capType)
      : [...selectedCaps, capType];

    onFilterChange({ ...filters, marketCap: newCaps });
  };

  const handleSectorToggle = (sector) => {
    const selectedSectors = filters.sectors || [];
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter(s => s !== sector)
      : [...selectedSectors, sector];

    onFilterChange({ ...filters, sectors: newSectors });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Filters
          </h2>
          <button
            onClick={onReset}
            className="text-sm text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500 font-medium"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-5 space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                className="form-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Market Cap */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Market Cap
          </label>
          <div className="space-y-2">
            {MARKET_CAP_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.marketCap || []).includes(option.value)}
                  onChange={() => handleMarketCapToggle(option.value)}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Minimum Volume
          </label>
          <input
            type="number"
            placeholder="e.g., 1000000"
            value={filters.volumeMin || ''}
            onChange={(e) => handleInputChange('volumeMin', e.target.value)}
            className="form-input w-full"
          />
        </div>

        {/* P/E Ratio */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            P/E Ratio
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.peMin || ''}
                onChange={(e) => handleInputChange('peMin', e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.peMax || ''}
                onChange={(e) => handleInputChange('peMax', e.target.value)}
                className="form-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Dividend Yield */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Minimum Dividend Yield (%)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 2.5"
            value={filters.dividendYieldMin || ''}
            onChange={(e) => handleInputChange('dividendYieldMin', e.target.value)}
            className="form-input w-full"
          />
        </div>

        {/* Price Change % */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Price Change (%)
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Today
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.changeDayMin || ''}
                  onChange={(e) => handleInputChange('changeDayMin', e.target.value)}
                  className="form-input w-full"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.changeDayMax || ''}
                  onChange={(e) => handleInputChange('changeDayMax', e.target.value)}
                  className="form-input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sectors */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
            Sectors
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {SECTORS.map((sector) => (
              <label key={sector} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.sectors || []).includes(sector)}
                  onChange={() => handleSectorToggle(sector)}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                  {sector}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={onSearch}
          className="btn bg-violet-500 hover:bg-violet-600 text-white w-full"
        >
          <svg
            className="fill-current shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
          </svg>
          <span className="ml-2">Apply Filters</span>
        </button>
      </div>
    </div>
  );
}
