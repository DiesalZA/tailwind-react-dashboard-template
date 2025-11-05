/**
 * Market Data Service
 *
 * Handles all market-related API calls (indices, sectors, movers, news)
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

const marketService = {
  /**
   * Get major market indices
   *
   * @returns {Promise<{success: boolean, data?: MarketIndex[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/indices
   * Expected response: { indices: [{ symbol, name, price, change, changePercent, ... }] }
   */
  async getIndices() {
    return apiClient.get(API_ENDPOINTS.MARKET.INDICES);
  },

  /**
   * Get specific market index
   *
   * @param {string} symbol - Index symbol (e.g., "^GSPC", "^IXIC", "^DJI")
   * @returns {Promise<{success: boolean, data?: MarketIndex, error?: object}>}
   *
   * Example backend endpoint: GET /api/market/indices/^GSPC
   * Expected response: { symbol, name, price, change, changePercent, ... }
   */
  async getIndex(symbol) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.INDICES}/${symbol}`);
  },

  /**
   * Get sector performance
   *
   * @returns {Promise<{success: boolean, data?: Sector[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/sectors
   * Expected response: { sectors: [{ name, change, volume, marketCap, performance, ... }] }
   */
  async getSectors() {
    return apiClient.get(API_ENDPOINTS.MARKET.SECTORS);
  },

  /**
   * Get specific sector performance
   *
   * @param {string} sectorName - Sector name (e.g., "Technology", "Healthcare")
   * @returns {Promise<{success: boolean, data?: Sector, error?: object}>}
   *
   * Example backend endpoint: GET /api/market/sectors/Technology
   * Expected response: { name, change, volume, marketCap, performance, topStocks: [...] }
   */
  async getSector(sectorName) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.SECTORS}/${sectorName}`);
  },

  /**
   * Get market movers (gainers, losers, most active)
   *
   * @param {object} options - Query options
   * @param {number} options.limit - Number of stocks per category (default: 10)
   * @returns {Promise<{success: boolean, data?: Movers, error?: object}>}
   *
   * Example backend endpoint: GET /api/market/movers?limit=10
   * Expected response: { gainers: [...], losers: [...], mostActive: [...] }
   */
  async getMovers(options = {}) {
    const { limit = 10 } = options;
    return apiClient.get(API_ENDPOINTS.MARKET.MOVERS, { limit });
  },

  /**
   * Get top gainers
   *
   * @param {number} limit - Number of stocks (default: 10)
   * @returns {Promise<{success: boolean, data?: Mover[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/movers/gainers?limit=10
   * Expected response: { gainers: [{ symbol, name, price, change, changePercent, ... }] }
   */
  async getGainers(limit = 10) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.MOVERS}/gainers`, { limit });
  },

  /**
   * Get top losers
   *
   * @param {number} limit - Number of stocks (default: 10)
   * @returns {Promise<{success: boolean, data?: Mover[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/movers/losers?limit=10
   * Expected response: { losers: [{ symbol, name, price, change, changePercent, ... }] }
   */
  async getLosers(limit = 10) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.MOVERS}/losers`, { limit });
  },

  /**
   * Get most active stocks by volume
   *
   * @param {number} limit - Number of stocks (default: 10)
   * @returns {Promise<{success: boolean, data?: Mover[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/movers/active?limit=10
   * Expected response: { mostActive: [{ symbol, name, price, volume, ... }] }
   */
  async getMostActive(limit = 10) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.MOVERS}/active`, { limit });
  },

  /**
   * Get market news
   *
   * @param {object} options - Query options
   * @param {number} options.limit - Number of articles (default: 20)
   * @param {string} options.category - Filter by category (e.g., "earnings", "merger", "ipo")
   * @param {string[]} options.symbols - Filter by stock symbols
   * @returns {Promise<{success: boolean, data?: MarketNews[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/news?limit=20&category=earnings
   * Expected response: { articles: [{ id, title, summary, url, source, publishedAt, ... }] }
   */
  async getNews(options = {}) {
    const { limit = 20, category, symbols } = options;
    const params = { limit };

    if (category) params.category = category;
    if (symbols && symbols.length > 0) params.symbols = symbols.join(',');

    return apiClient.get(API_ENDPOINTS.MARKET.NEWS, params);
  },

  /**
   * Get market status (open/closed)
   *
   * @returns {Promise<{success: boolean, data?: MarketStatus, error?: object}>}
   *
   * Example backend endpoint: GET /api/market/status
   * Expected response: { isOpen, status, nextOpen, nextClose, timezone }
   */
  async getStatus() {
    return apiClient.get(API_ENDPOINTS.MARKET.STATUS);
  },

  /**
   * Get economic calendar events
   *
   * @param {object} options - Query options
   * @param {string} options.startDate - Start date (ISO format)
   * @param {string} options.endDate - End date (ISO format)
   * @param {string} options.importance - Filter by importance ("high", "medium", "low")
   * @returns {Promise<{success: boolean, data?: EconomicEvent[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/calendar?start_date=2024-03-15&end_date=2024-03-22
   * Expected response: { events: [{ date, event, actual, forecast, previous, importance, ... }] }
   */
  async getEconomicCalendar(options = {}) {
    const { startDate, endDate, importance } = options;
    const params = {};

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (importance) params.importance = importance;

    return apiClient.get(`${API_ENDPOINTS.MARKET.NEWS}/calendar`, params);
  },

  /**
   * Get IPO calendar
   *
   * @param {object} options - Query options
   * @param {string} options.startDate - Start date (ISO format)
   * @param {string} options.endDate - End date (ISO format)
   * @returns {Promise<{success: boolean, data?: IPO[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/ipo?start_date=2024-03-15&end_date=2024-03-22
   * Expected response: { ipos: [{ symbol, name, date, priceRange, shares, ... }] }
   */
  async getIPOCalendar(options = {}) {
    const { startDate, endDate } = options;
    const params = {};

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return apiClient.get(`${API_ENDPOINTS.MARKET.NEWS}/ipo`, params);
  },

  /**
   * Get earnings calendar
   *
   * @param {object} options - Query options
   * @param {string} options.startDate - Start date (ISO format)
   * @param {string} options.endDate - End date (ISO format)
   * @param {string} options.symbol - Filter by stock symbol
   * @returns {Promise<{success: boolean, data?: Earnings[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/earnings?start_date=2024-03-15&end_date=2024-03-22
   * Expected response: { earnings: [{ symbol, name, date, eps, epsEstimate, ... }] }
   */
  async getEarningsCalendar(options = {}) {
    const { startDate, endDate, symbol } = options;
    const params = {};

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (symbol) params.symbol = symbol;

    return apiClient.get(`${API_ENDPOINTS.MARKET.NEWS}/earnings`, params);
  },

  /**
   * Search market news
   *
   * @param {string} query - Search query
   * @param {number} limit - Number of results (default: 20)
   * @returns {Promise<{success: boolean, data?: MarketNews[], error?: object}>}
   *
   * Example backend endpoint: GET /api/market/news/search?q=tesla&limit=20
   * Expected response: { articles: [...] }
   */
  async searchNews(query, limit = 20) {
    return apiClient.get(`${API_ENDPOINTS.MARKET.NEWS}/search`, {
      q: query,
      limit,
    });
  },
};

export default marketService;
