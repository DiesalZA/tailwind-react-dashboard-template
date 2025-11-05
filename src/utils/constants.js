/**
 * API Configuration Constants
 */

// Base API URL - update this to point to your Django/FastAPI backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Stocks
  STOCKS: {
    SEARCH: '/stocks/search',
    QUOTE: '/stocks/quote',
    HISTORICAL: '/stocks/historical',
    FUNDAMENTALS: '/stocks/fundamentals',
    NEWS: '/stocks/news',
    POPULAR: '/stocks/popular',
  },

  // Portfolio
  PORTFOLIO: {
    LIST: '/portfolio',
    DETAIL: '/portfolio/:id',
    HOLDINGS: '/portfolio/:id/holdings',
    TRANSACTIONS: '/portfolio/:id/transactions',
    PERFORMANCE: '/portfolio/:id/performance',
    SUMMARY: '/portfolio/summary',
  },

  // Watchlist
  WATCHLIST: {
    LIST: '/watchlist',
    DETAIL: '/watchlist/:id',
    ITEMS: '/watchlist/:id/items',
  },

  // Market Data
  MARKET: {
    INDICES: '/market/indices',
    SECTORS: '/market/sectors',
    MOVERS: '/market/movers',
    NEWS: '/market/news',
    STATUS: '/market/status',
  },

  // Screener
  SCREENER: {
    SCREEN: '/screener/screen',
    SAVED: '/screener/saved',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_EXPANDED: 'sidebar-expanded',
};

// WebSocket Configuration
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws';

// Chart Timeframes
export const TIMEFRAMES = {
  '1D': { label: '1 Day', interval: '5m', days: 1 },
  '1W': { label: '1 Week', interval: '30m', days: 7 },
  '1M': { label: '1 Month', interval: '1h', days: 30 },
  '3M': { label: '3 Months', interval: '1d', days: 90 },
  '6M': { label: '6 Months', interval: '1d', days: 180 },
  '1Y': { label: '1 Year', interval: '1d', days: 365 },
  '5Y': { label: '5 Years', interval: '1wk', days: 1825 },
  'MAX': { label: 'Max', interval: '1mo', days: null },
};

// Market Hours (EST)
export const MARKET_HOURS = {
  OPEN: '09:30',
  CLOSE: '16:00',
  TIMEZONE: 'America/New_York',
};
