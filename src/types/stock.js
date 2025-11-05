/**
 * Stock Data Type Definitions
 *
 * These are example data structures that your backend API should return.
 * Adapt these to match your actual Django/FastAPI response schemas.
 */

/**
 * @typedef {Object} Stock
 * @property {string} symbol - Stock ticker symbol (e.g., "AAPL")
 * @property {string} name - Company name (e.g., "Apple Inc.")
 * @property {string} exchange - Exchange name (e.g., "NASDAQ")
 * @property {string} currency - Currency code (e.g., "USD")
 * @property {string} type - Security type (e.g., "Common Stock")
 * @property {string} region - Region/country (e.g., "United States")
 * @property {string} sector - Sector (e.g., "Technology")
 * @property {string} industry - Industry (e.g., "Consumer Electronics")
 */

/**
 * @typedef {Object} Quote
 * @property {string} symbol - Stock symbol
 * @property {number} price - Current price
 * @property {number} change - Price change (absolute)
 * @property {number} changePercent - Price change (percentage)
 * @property {number} previousClose - Previous closing price
 * @property {number} open - Opening price
 * @property {number} high - Day's high price
 * @property {number} low - Day's low price
 * @property {number} volume - Trading volume
 * @property {number} avgVolume - Average volume
 * @property {number} marketCap - Market capitalization
 * @property {number} peRatio - Price to earnings ratio
 * @property {number} eps - Earnings per share
 * @property {number} week52High - 52-week high
 * @property {number} week52Low - 52-week low
 * @property {string} lastUpdated - ISO timestamp of last update
 */

/**
 * @typedef {Object} HistoricalDataPoint
 * @property {string} date - ISO date string
 * @property {number} open - Opening price
 * @property {number} high - High price
 * @property {number} low - Low price
 * @property {number} close - Closing price
 * @property {number} volume - Trading volume
 * @property {number} [adjustedClose] - Adjusted close (optional)
 */

/**
 * @typedef {Object} HistoricalData
 * @property {string} symbol - Stock symbol
 * @property {string} interval - Time interval (e.g., "1d", "1h", "5m")
 * @property {HistoricalDataPoint[]} data - Historical data points
 */

/**
 * @typedef {Object} Fundamentals
 * @property {string} symbol - Stock symbol
 * @property {string} name - Company name
 * @property {string} description - Company description
 * @property {string} sector - Sector
 * @property {string} industry - Industry
 * @property {string} ceo - CEO name
 * @property {number} employees - Number of employees
 * @property {string} address - Company address
 * @property {string} website - Company website
 * @property {string} phone - Company phone
 * @property {number} marketCap - Market capitalization
 * @property {number} sharesOutstanding - Shares outstanding
 * @property {number} peRatio - P/E ratio
 * @property {number} pegRatio - PEG ratio
 * @property {number} pbRatio - P/B ratio
 * @property {number} priceToSales - Price to sales ratio
 * @property {number} eps - Earnings per share
 * @property {number} dividendYield - Dividend yield (percentage)
 * @property {number} beta - Beta value
 * @property {number} targetPrice - Analyst target price
 * @property {number} revenue - Annual revenue
 * @property {number} revenueGrowth - Revenue growth (percentage)
 * @property {number} netIncome - Net income
 * @property {number} profitMargin - Profit margin (percentage)
 * @property {number} operatingMargin - Operating margin (percentage)
 * @property {number} returnOnEquity - Return on equity (percentage)
 * @property {number} returnOnAssets - Return on assets (percentage)
 * @property {number} debtToEquity - Debt to equity ratio
 * @property {number} currentRatio - Current ratio
 */

/**
 * @typedef {Object} StockNews
 * @property {string} id - Unique identifier
 * @property {string} symbol - Related stock symbol
 * @property {string} title - News title
 * @property {string} summary - News summary/excerpt
 * @property {string} url - Article URL
 * @property {string} source - News source
 * @property {string} publishedAt - ISO timestamp
 * @property {string} image - Image URL (optional)
 * @property {string} sentiment - Sentiment (e.g., "positive", "negative", "neutral")
 */

/**
 * Example API Response Structures
 */

export const EXAMPLE_STOCK = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  exchange: 'NASDAQ',
  currency: 'USD',
  type: 'Common Stock',
  region: 'United States',
  sector: 'Technology',
  industry: 'Consumer Electronics',
};

export const EXAMPLE_QUOTE = {
  symbol: 'AAPL',
  price: 178.45,
  change: 2.34,
  changePercent: 1.33,
  previousClose: 176.11,
  open: 176.50,
  high: 179.23,
  low: 175.89,
  volume: 52384910,
  avgVolume: 55000000,
  marketCap: 2800000000000,
  peRatio: 29.5,
  eps: 6.05,
  week52High: 199.62,
  week52Low: 164.08,
  lastUpdated: '2024-03-15T20:00:00Z',
};

export const EXAMPLE_HISTORICAL_DATA = {
  symbol: 'AAPL',
  interval: '1d',
  data: [
    {
      date: '2024-03-15',
      open: 176.50,
      high: 179.23,
      low: 175.89,
      close: 178.45,
      volume: 52384910,
    },
    // ... more data points
  ],
};

export const EXAMPLE_FUNDAMENTALS = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
  sector: 'Technology',
  industry: 'Consumer Electronics',
  ceo: 'Tim Cook',
  employees: 164000,
  address: 'One Apple Park Way, Cupertino, CA 95014',
  website: 'https://www.apple.com',
  phone: '+1-408-996-1010',
  marketCap: 2800000000000,
  sharesOutstanding: 15700000000,
  peRatio: 29.5,
  pegRatio: 2.1,
  pbRatio: 45.2,
  priceToSales: 7.3,
  eps: 6.05,
  dividendYield: 0.52,
  beta: 1.24,
  targetPrice: 195.00,
  revenue: 383285000000,
  revenueGrowth: -2.8,
  netIncome: 96995000000,
  profitMargin: 25.3,
  operatingMargin: 29.8,
  returnOnEquity: 147.4,
  returnOnAssets: 22.6,
  debtToEquity: 181.7,
  currentRatio: 0.98,
};

export const EXAMPLE_NEWS = {
  id: '1',
  symbol: 'AAPL',
  title: 'Apple Announces New Product Launch',
  summary: 'Apple Inc. announced today that it will launch a new product line next month...',
  url: 'https://example.com/article',
  source: 'TechCrunch',
  publishedAt: '2024-03-15T14:30:00Z',
  image: 'https://example.com/image.jpg',
  sentiment: 'positive',
};
