/**
 * Stock-Specific Utility Functions
 *
 * Formatting and calculation helpers for stock data
 */

/**
 * Format stock price
 * @param {number} price - Stock price
 * @param {string} currency - Currency code (default: "USD")
 * @returns {string} Formatted price (e.g., "$123.45")
 */
export function formatStockPrice(price, currency = 'USD') {
  if (price === null || price === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format market cap
 * @param {number} value - Market cap value
 * @returns {string} Formatted market cap (e.g., "$1.23T", "$456.78B", "$12.34M")
 */
export function formatMarketCap(value) {
  if (value === null || value === undefined) return 'N/A';

  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;

  if (value >= trillion) {
    return `$${(value / trillion).toFixed(2)}T`;
  } else if (value >= billion) {
    return `$${(value / billion).toFixed(2)}B`;
  } else if (value >= million) {
    return `$${(value / million).toFixed(2)}M`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

/**
 * Format volume
 * @param {number} volume - Trading volume
 * @returns {string} Formatted volume (e.g., "1.23M", "456.78K")
 */
export function formatVolume(volume) {
  if (volume === null || volume === undefined) return 'N/A';

  const million = 1e6;
  const thousand = 1e3;

  if (volume >= million) {
    return `${(volume / million).toFixed(2)}M`;
  } else if (volume >= thousand) {
    return `${(volume / thousand).toFixed(2)}K`;
  } else {
    return volume.toLocaleString();
  }
}

/**
 * Format percentage change
 * @param {number} percent - Percentage value
 * @param {boolean} showSign - Show + sign for positive values (default: true)
 * @returns {string} Formatted percentage (e.g., "+1.23%", "-0.45%")
 */
export function formatPercent(percent, showSign = true) {
  if (percent === null || percent === undefined) return 'N/A';

  const sign = percent > 0 && showSign ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Format price change
 * @param {number} change - Price change value
 * @param {boolean} showSign - Show + sign for positive values (default: true)
 * @returns {string} Formatted change (e.g., "+1.23", "-0.45")
 */
export function formatChange(change, showSign = true) {
  if (change === null || change === undefined) return 'N/A';

  const sign = change > 0 && showSign ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

/**
 * Calculate profit/loss
 * @param {number} cost - Total cost basis
 * @param {number} currentValue - Current market value
 * @returns {number} Profit/loss amount
 */
export function calculateProfitLoss(cost, currentValue) {
  return currentValue - cost;
}

/**
 * Calculate profit/loss percentage
 * @param {number} cost - Total cost basis
 * @param {number} currentValue - Current market value
 * @returns {number} Profit/loss percentage
 */
export function calculateProfitLossPercent(cost, currentValue) {
  if (cost === 0) return 0;
  return ((currentValue - cost) / cost) * 100;
}

/**
 * Calculate percent change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export function calculatePercentChange(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get color class for change value
 * @param {number} change - Change value (can be absolute or percentage)
 * @returns {string} Tailwind color class
 */
export function getChangeColor(change) {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500 dark:text-gray-400';
}

/**
 * Get background color class for change value
 * @param {number} change - Change value
 * @returns {string} Tailwind background color class
 */
export function getChangeBgColor(change) {
  if (change > 0) return 'bg-green-500';
  if (change < 0) return 'bg-red-500';
  return 'bg-gray-500';
}

/**
 * Get market cap category
 * @param {number} marketCap - Market capitalization value
 * @returns {string} Category ("Mega Cap", "Large Cap", "Mid Cap", "Small Cap", "Micro Cap", "Nano Cap")
 */
export function getMarketCapCategory(marketCap) {
  if (marketCap === null || marketCap === undefined) return 'Unknown';

  const billion = 1e9;

  if (marketCap >= 200 * billion) return 'Mega Cap';
  if (marketCap >= 10 * billion) return 'Large Cap';
  if (marketCap >= 2 * billion) return 'Mid Cap';
  if (marketCap >= 300 * 1e6) return 'Small Cap';
  if (marketCap >= 50 * 1e6) return 'Micro Cap';
  return 'Nano Cap';
}

/**
 * Validate stock symbol format
 * @param {string} symbol - Stock symbol
 * @returns {boolean} True if valid format
 */
export function isValidSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') return false;
  // Basic validation: 1-5 uppercase letters, optionally followed by a dot and more letters (for international stocks)
  return /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/.test(symbol.trim().toUpperCase());
}

/**
 * Normalize stock symbol (uppercase and trim)
 * @param {string} symbol - Stock symbol
 * @returns {string} Normalized symbol
 */
export function normalizeSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') return '';
  return symbol.trim().toUpperCase();
}

/**
 * Calculate portfolio allocation percentage
 * @param {number} holdingValue - Value of specific holding
 * @param {number} totalValue - Total portfolio value
 * @returns {number} Allocation percentage
 */
export function calculateAllocation(holdingValue, totalValue) {
  if (totalValue === 0) return 0;
  return (holdingValue / totalValue) * 100;
}

/**
 * Format ratio (e.g., P/E, P/B)
 * @param {number} ratio - Ratio value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted ratio
 */
export function formatRatio(ratio, decimals = 2) {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return 'N/A';
  return ratio.toFixed(decimals);
}

/**
 * Format EPS (Earnings Per Share)
 * @param {number} eps - EPS value
 * @returns {string} Formatted EPS
 */
export function formatEPS(eps) {
  if (eps === null || eps === undefined) return 'N/A';
  return `$${eps.toFixed(2)}`;
}

/**
 * Format dividend yield
 * @param {number} yield - Dividend yield percentage
 * @returns {string} Formatted yield
 */
export function formatDividendYield(yieldValue) {
  if (yieldValue === null || yieldValue === undefined) return 'N/A';
  return `${yieldValue.toFixed(2)}%`;
}

/**
 * Get trading day boundaries (start and end of day)
 * @param {Date} date - Date object
 * @returns {object} Object with start and end timestamps
 */
export function getTradingDayBounds(date = new Date()) {
  const start = new Date(date);
  start.setHours(9, 30, 0, 0); // 9:30 AM

  const end = new Date(date);
  end.setHours(16, 0, 0, 0); // 4:00 PM

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Check if market is currently open (simplified - EST/EDT only)
 * @returns {boolean} True if market is open
 */
export function isMarketOpen() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Weekend check
  if (day === 0 || day === 6) return false;

  // Get current time in EST/EDT (approximate)
  // Note: For production, use a proper timezone library like date-fns-tz
  const hours = now.getUTCHours() - 5; // EST is UTC-5
  const minutes = now.getUTCMinutes();
  const currentTime = hours * 60 + minutes;

  // Market hours: 9:30 AM to 4:00 PM EST
  const marketOpen = 9 * 60 + 30; // 9:30 AM in minutes
  const marketClose = 16 * 60; // 4:00 PM in minutes

  return currentTime >= marketOpen && currentTime < marketClose;
}

/**
 * Get market status text
 * @returns {string} Market status ("Open", "Closed", "Pre-Market", "After-Hours")
 */
export function getMarketStatus() {
  const now = new Date();
  const day = now.getDay();

  // Weekend
  if (day === 0 || day === 6) return 'Closed';

  const hours = now.getUTCHours() - 5; // EST approximation
  const minutes = now.getUTCMinutes();
  const currentTime = hours * 60 + minutes;

  const preMarketStart = 4 * 60; // 4:00 AM
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  const afterHoursEnd = 20 * 60; // 8:00 PM

  if (currentTime >= marketOpen && currentTime < marketClose) {
    return 'Open';
  } else if (currentTime >= preMarketStart && currentTime < marketOpen) {
    return 'Pre-Market';
  } else if (currentTime >= marketClose && currentTime < afterHoursEnd) {
    return 'After-Hours';
  } else {
    return 'Closed';
  }
}

/**
 * Abbreviate company name for display
 * @param {string} name - Full company name
 * @param {number} maxLength - Maximum length (default: 30)
 * @returns {string} Abbreviated name
 */
export function abbreviateName(name, maxLength = 30) {
  if (!name) return '';
  if (name.length <= maxLength) return name;

  // Remove common suffixes
  const cleaned = name
    .replace(/, Inc\.$/, '')
    .replace(/ Inc\.$/, '')
    .replace(/ Corporation$/, '')
    .replace(/ Corp\.$/, '')
    .replace(/ Ltd\.$/, '')
    .replace(/ Limited$/, '')
    .replace(/ LLC$/, '');

  if (cleaned.length <= maxLength) return cleaned;

  return cleaned.substring(0, maxLength - 3) + '...';
}
