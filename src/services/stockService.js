/**
 * Stock Service
 *
 * Handles all stock-related API calls
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

const stockService = {
  /**
   * Search for stocks by symbol or company name
   *
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results (default: 10)
   * @returns {Promise<{success: boolean, data?: Stock[], error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/search?q=apple&limit=10
   * Expected response: { results: [{ symbol, name, exchange, ... }] }
   */
  async search(query, limit = 10) {
    return apiClient.get(API_ENDPOINTS.STOCKS.SEARCH, {
      q: query,
      limit,
    });
  },

  /**
   * Get real-time quote for a stock
   *
   * @param {string} symbol - Stock symbol (e.g., "AAPL")
   * @returns {Promise<{success: boolean, data?: Quote, error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/quote/AAPL
   * Expected response: { symbol, price, change, changePercent, ... }
   */
  async getQuote(symbol) {
    return apiClient.get(`${API_ENDPOINTS.STOCKS.QUOTE}/${symbol}`);
  },

  /**
   * Get quotes for multiple stocks
   *
   * @param {string[]} symbols - Array of stock symbols
   * @returns {Promise<{success: boolean, data?: Quote[], error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/quote?symbols=AAPL,MSFT,GOOGL
   * Expected response: { quotes: [{ symbol, price, ... }, ...] }
   */
  async getQuotes(symbols) {
    return apiClient.get(API_ENDPOINTS.STOCKS.QUOTE, {
      symbols: symbols.join(','),
    });
  },

  /**
   * Get historical price data
   *
   * @param {string} symbol - Stock symbol
   * @param {object} options - Query options
   * @param {string} options.interval - Time interval (e.g., "1d", "1h", "5m")
   * @param {string} options.startDate - Start date (ISO format)
   * @param {string} options.endDate - End date (ISO format)
   * @param {string} options.period - Period (e.g., "1D", "1M", "1Y") - alternative to start/end dates
   * @returns {Promise<{success: boolean, data?: HistoricalData, error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/historical/AAPL?interval=1d&period=1M
   * Expected response: { symbol, interval, data: [{ date, open, high, low, close, volume }, ...] }
   */
  async getHistoricalData(symbol, options = {}) {
    const { interval = '1d', startDate, endDate, period = '1M' } = options;

    const params = { interval };

    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    } else {
      params.period = period;
    }

    return apiClient.get(`${API_ENDPOINTS.STOCKS.HISTORICAL}/${symbol}`, params);
  },

  /**
   * Get company fundamentals
   *
   * @param {string} symbol - Stock symbol
   * @returns {Promise<{success: boolean, data?: Fundamentals, error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/fundamentals/AAPL
   * Expected response: { symbol, name, description, sector, marketCap, peRatio, ... }
   */
  async getFundamentals(symbol) {
    return apiClient.get(`${API_ENDPOINTS.STOCKS.FUNDAMENTALS}/${symbol}`);
  },

  /**
   * Get stock news
   *
   * @param {string} symbol - Stock symbol
   * @param {number} limit - Maximum number of articles (default: 20)
   * @returns {Promise<{success: boolean, data?: StockNews[], error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/news/AAPL?limit=20
   * Expected response: { articles: [{ id, title, summary, url, source, publishedAt, ... }] }
   */
  async getNews(symbol, limit = 20) {
    return apiClient.get(`${API_ENDPOINTS.STOCKS.NEWS}/${symbol}`, {
      limit,
    });
  },

  /**
   * Get popular/trending stocks
   *
   * @param {number} limit - Maximum number of stocks (default: 10)
   * @returns {Promise<{success: boolean, data?: Stock[], error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/popular?limit=10
   * Expected response: { stocks: [{ symbol, name, price, change, ... }] }
   */
  async getPopular(limit = 10) {
    return apiClient.get(API_ENDPOINTS.STOCKS.POPULAR, {
      limit,
    });
  },

  /**
   * Get intraday data for a stock (useful for live charts)
   *
   * @param {string} symbol - Stock symbol
   * @param {string} interval - Time interval (e.g., "1m", "5m", "15m")
   * @returns {Promise<{success: boolean, data?: HistoricalData, error?: object}>}
   *
   * Example backend endpoint: GET /api/stocks/intraday/AAPL?interval=5m
   * Expected response: { symbol, interval, data: [{ date, open, high, low, close, volume }, ...] }
   */
  async getIntradayData(symbol, interval = '5m') {
    return apiClient.get(`${API_ENDPOINTS.STOCKS.HISTORICAL}/${symbol}`, {
      interval,
      period: '1D',
    });
  },
};

export default stockService;
