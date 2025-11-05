/**
 * Market Data Type Definitions
 *
 * These are example data structures that your backend API should return.
 * Adapt these to match your actual Django/FastAPI response schemas.
 */

/**
 * @typedef {Object} MarketIndex
 * @property {string} symbol - Index symbol (e.g., "^GSPC" for S&P 500)
 * @property {string} name - Index name
 * @property {number} price - Current value
 * @property {number} change - Value change (absolute)
 * @property {number} changePercent - Value change (percentage)
 * @property {number} high - Day's high
 * @property {number} low - Day's low
 * @property {number} open - Opening value
 * @property {number} previousClose - Previous closing value
 * @property {string} lastUpdated - ISO timestamp
 */

/**
 * @typedef {Object} Sector
 * @property {string} name - Sector name
 * @property {number} change - Change (percentage)
 * @property {number} volume - Total volume
 * @property {number} marketCap - Total market cap
 * @property {string} performance - Performance rating (e.g., "outperform", "neutral", "underperform")
 */

/**
 * @typedef {Object} Mover
 * @property {string} symbol - Stock symbol
 * @property {string} name - Stock name
 * @property {number} price - Current price
 * @property {number} change - Price change (absolute)
 * @property {number} changePercent - Price change (percentage)
 * @property {number} volume - Trading volume
 * @property {number} marketCap - Market capitalization
 */

/**
 * @typedef {Object} Movers
 * @property {Mover[]} gainers - Top gainers
 * @property {Mover[]} losers - Top losers
 * @property {Mover[]} mostActive - Most active by volume
 */

/**
 * @typedef {Object} MarketNews
 * @property {string} id - Unique identifier
 * @property {string} title - News title
 * @property {string} summary - News summary/excerpt
 * @property {string} url - Article URL
 * @property {string} source - News source
 * @property {string} publishedAt - ISO timestamp
 * @property {string} image - Image URL (optional)
 * @property {string[]} symbols - Related stock symbols
 * @property {string} category - Category (e.g., "earnings", "merger", "ipo")
 */

/**
 * @typedef {Object} MarketStatus
 * @property {boolean} isOpen - Whether market is currently open
 * @property {string} status - Status ("open", "closed", "pre-market", "after-hours")
 * @property {string} nextOpen - ISO timestamp of next market open
 * @property {string} nextClose - ISO timestamp of next market close
 * @property {string} timezone - Market timezone
 */

/**
 * Example API Response Structures
 */

export const EXAMPLE_MARKET_INDICES = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 5234.18,
    change: 45.23,
    changePercent: 0.87,
    high: 5245.67,
    low: 5210.34,
    open: 5215.00,
    previousClose: 5188.95,
    lastUpdated: '2024-03-15T20:00:00Z',
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    price: 16401.84,
    change: -32.45,
    changePercent: -0.20,
    high: 16450.23,
    low: 16380.12,
    open: 16425.00,
    previousClose: 16434.29,
    lastUpdated: '2024-03-15T20:00:00Z',
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    price: 39566.85,
    change: 125.67,
    changePercent: 0.32,
    high: 39600.12,
    low: 39450.34,
    open: 39475.00,
    previousClose: 39441.18,
    lastUpdated: '2024-03-15T20:00:00Z',
  },
];

export const EXAMPLE_SECTORS = [
  {
    name: 'Technology',
    change: 1.45,
    volume: 2345678900,
    marketCap: 15000000000000,
    performance: 'outperform',
  },
  {
    name: 'Healthcare',
    change: 0.34,
    volume: 987654321,
    marketCap: 8000000000000,
    performance: 'neutral',
  },
  {
    name: 'Financials',
    change: -0.67,
    volume: 1234567890,
    marketCap: 9500000000000,
    performance: 'underperform',
  },
  {
    name: 'Energy',
    change: 2.34,
    volume: 765432109,
    marketCap: 5500000000000,
    performance: 'outperform',
  },
  {
    name: 'Consumer Discretionary',
    change: -0.23,
    volume: 1456789012,
    marketCap: 7800000000000,
    performance: 'neutral',
  },
];

export const EXAMPLE_MOVERS = {
  gainers: [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 875.34,
      change: 45.23,
      changePercent: 5.45,
      volume: 45678900,
      marketCap: 2150000000000,
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: 189.45,
      change: 8.67,
      changePercent: 4.79,
      volume: 34567890,
      marketCap: 305000000000,
    },
    // ... more gainers
  ],
  losers: [
    {
      symbol: 'INTC',
      name: 'Intel Corporation',
      price: 42.15,
      change: -3.45,
      changePercent: -7.57,
      volume: 56789012,
      marketCap: 175000000000,
    },
    {
      symbol: 'SNAP',
      name: 'Snap Inc.',
      price: 11.23,
      change: -0.87,
      changePercent: -7.19,
      volume: 23456789,
      marketCap: 18000000000,
    },
    // ... more losers
  ],
  mostActive: [
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 172.34,
      change: 2.45,
      changePercent: 1.44,
      volume: 125678900,
      marketCap: 545000000000,
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.45,
      change: 2.34,
      changePercent: 1.33,
      volume: 52384910,
      marketCap: 2800000000000,
    },
    // ... more active
  ],
};

export const EXAMPLE_MARKET_NEWS = [
  {
    id: 'news-1',
    title: 'Fed Announces Interest Rate Decision',
    summary: 'The Federal Reserve announced today that it will maintain interest rates at current levels...',
    url: 'https://example.com/news/1',
    source: 'Reuters',
    publishedAt: '2024-03-15T14:00:00Z',
    image: 'https://example.com/images/fed.jpg',
    symbols: ['SPY', 'QQQ'],
    category: 'monetary-policy',
  },
  {
    id: 'news-2',
    title: 'Tech Giant Reports Earnings Beat',
    summary: 'Major technology company exceeded analyst expectations in its quarterly earnings report...',
    url: 'https://example.com/news/2',
    source: 'Bloomberg',
    publishedAt: '2024-03-15T12:30:00Z',
    image: 'https://example.com/images/earnings.jpg',
    symbols: ['AAPL', 'MSFT', 'GOOGL'],
    category: 'earnings',
  },
  // ... more news
];

export const EXAMPLE_MARKET_STATUS = {
  isOpen: false,
  status: 'closed',
  nextOpen: '2024-03-18T13:30:00Z',
  nextClose: '2024-03-18T20:00:00Z',
  timezone: 'America/New_York',
};

/**
 * Market Status Types
 */
export const MARKET_STATUS_TYPES = {
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre-market',
  AFTER_HOURS: 'after-hours',
};
