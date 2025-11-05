/**
 * Watchlist Data Type Definitions
 *
 * These are example data structures that your backend API should return.
 * Adapt these to match your actual Django/FastAPI response schemas.
 */

/**
 * @typedef {Object} Watchlist
 * @property {string} id - Watchlist ID
 * @property {string} name - Watchlist name
 * @property {string} description - Watchlist description
 * @property {number} itemCount - Number of items in watchlist
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} WatchlistItem
 * @property {string} id - Item ID
 * @property {string} watchlistId - Watchlist ID
 * @property {string} symbol - Stock symbol
 * @property {string} name - Stock name
 * @property {number} price - Current price
 * @property {number} change - Price change (absolute)
 * @property {number} changePercent - Price change (percentage)
 * @property {number} volume - Trading volume
 * @property {number} marketCap - Market capitalization
 * @property {string} notes - User notes
 * @property {string} addedAt - ISO timestamp when added
 * @property {string} lastUpdated - ISO timestamp of last price update
 */

/**
 * @typedef {Object} WatchlistWithItems
 * @property {Watchlist} watchlist - Watchlist details
 * @property {WatchlistItem[]} items - Items in watchlist
 */

/**
 * Example API Response Structures
 */

export const EXAMPLE_WATCHLIST = {
  id: 'watchlist-1',
  name: 'Tech Stocks',
  description: 'Technology sector watchlist',
  itemCount: 12,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-15T12:00:00Z',
};

export const EXAMPLE_WATCHLIST_ITEM = {
  id: 'item-1',
  watchlistId: 'watchlist-1',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 178.45,
  change: 2.34,
  changePercent: 1.33,
  volume: 52384910,
  marketCap: 2800000000000,
  notes: 'Considering buy at $170',
  addedAt: '2024-02-15T10:00:00Z',
  lastUpdated: '2024-03-15T20:00:00Z',
};

export const EXAMPLE_WATCHLIST_WITH_ITEMS = {
  watchlist: EXAMPLE_WATCHLIST,
  items: [
    EXAMPLE_WATCHLIST_ITEM,
    {
      id: 'item-2',
      watchlistId: 'watchlist-1',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 415.23,
      change: -3.45,
      changePercent: -0.82,
      volume: 25678345,
      marketCap: 3100000000000,
      notes: '',
      addedAt: '2024-02-20T14:30:00Z',
      lastUpdated: '2024-03-15T20:00:00Z',
    },
    // ... more items
  ],
};
