/**
 * Watchlist Service
 *
 * Handles all watchlist-related API calls
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

const watchlistService = {
  /**
   * Get all watchlists for the current user
   *
   * @returns {Promise<{success: boolean, data?: Watchlist[], error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist
   * Expected response: { watchlists: [{ id, name, description, itemCount, ... }] }
   */
  async getAll() {
    return apiClient.get(API_ENDPOINTS.WATCHLIST.LIST);
  },

  /**
   * Get watchlist by ID
   *
   * @param {string} watchlistId - Watchlist ID
   * @returns {Promise<{success: boolean, data?: Watchlist, error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist/123
   * Expected response: { id, name, description, itemCount, ... }
   */
  async getById(watchlistId) {
    return apiClient.get(API_ENDPOINTS.WATCHLIST.DETAIL, { id: watchlistId });
  },

  /**
   * Create a new watchlist
   *
   * @param {object} data - Watchlist data
   * @param {string} data.name - Watchlist name
   * @param {string} data.description - Watchlist description
   * @returns {Promise<{success: boolean, data?: Watchlist, error?: object}>}
   *
   * Example backend endpoint: POST /api/watchlist
   * Request body: { name, description }
   * Expected response: { id, name, description, itemCount, ... }
   */
  async create(data) {
    return apiClient.post(API_ENDPOINTS.WATCHLIST.LIST, data);
  },

  /**
   * Update watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {object} data - Updated watchlist data
   * @param {string} data.name - Watchlist name
   * @param {string} data.description - Watchlist description
   * @returns {Promise<{success: boolean, data?: Watchlist, error?: object}>}
   *
   * Example backend endpoint: PATCH /api/watchlist/123
   * Request body: { name?, description? }
   * Expected response: { id, name, description, itemCount, ... }
   */
  async update(watchlistId, data) {
    return apiClient.patch(API_ENDPOINTS.WATCHLIST.DETAIL, data, {
      params: { id: watchlistId },
    });
  },

  /**
   * Delete watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/watchlist/123
   * Expected response: { success: true }
   */
  async delete(watchlistId) {
    return apiClient.delete(API_ENDPOINTS.WATCHLIST.DETAIL, { id: watchlistId });
  },

  /**
   * Get all items in a watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @returns {Promise<{success: boolean, data?: WatchlistItem[], error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist/123/items
   * Expected response: { items: [{ id, symbol, name, price, change, ... }] }
   */
  async getItems(watchlistId) {
    return apiClient.get(API_ENDPOINTS.WATCHLIST.ITEMS, { id: watchlistId });
  },

  /**
   * Get watchlist with items (combined call)
   *
   * @param {string} watchlistId - Watchlist ID
   * @returns {Promise<{success: boolean, data?: WatchlistWithItems, error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist/123?include_items=true
   * Expected response: { watchlist: {...}, items: [...] }
   */
  async getWithItems(watchlistId) {
    return apiClient.get(API_ENDPOINTS.WATCHLIST.DETAIL, {
      id: watchlistId,
      include_items: true,
    });
  },

  /**
   * Add stock to watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {object} data - Stock data
   * @param {string} data.symbol - Stock symbol
   * @param {string} data.notes - Optional notes
   * @returns {Promise<{success: boolean, data?: WatchlistItem, error?: object}>}
   *
   * Example backend endpoint: POST /api/watchlist/123/items
   * Request body: { symbol, notes }
   * Expected response: { id, watchlistId, symbol, name, price, ... }
   */
  async addStock(watchlistId, data) {
    return apiClient.post(API_ENDPOINTS.WATCHLIST.ITEMS, data, {
      params: { id: watchlistId },
    });
  },

  /**
   * Add multiple stocks to watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string[]} symbols - Array of stock symbols
   * @returns {Promise<{success: boolean, data?: {added: number, errors: array}, error?: object}>}
   *
   * Example backend endpoint: POST /api/watchlist/123/items/bulk
   * Request body: { symbols: ["AAPL", "MSFT", "GOOGL"] }
   * Expected response: { added: 3, errors: [] }
   */
  async addStocks(watchlistId, symbols) {
    return apiClient.post(
      `${API_ENDPOINTS.WATCHLIST.ITEMS}/bulk`,
      { symbols },
      { params: { id: watchlistId } }
    );
  },

  /**
   * Update watchlist item (notes)
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string} itemId - Item ID
   * @param {object} data - Updated data
   * @param {string} data.notes - Updated notes
   * @returns {Promise<{success: boolean, data?: WatchlistItem, error?: object}>}
   *
   * Example backend endpoint: PATCH /api/watchlist/123/items/456
   * Request body: { notes }
   * Expected response: { id, symbol, notes, ... }
   */
  async updateItem(watchlistId, itemId, data) {
    return apiClient.patch(
      `${API_ENDPOINTS.WATCHLIST.ITEMS}/${itemId}`,
      data,
      { params: { id: watchlistId } }
    );
  },

  /**
   * Remove stock from watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string} itemId - Item ID
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/watchlist/123/items/456
   * Expected response: { success: true }
   */
  async removeStock(watchlistId, itemId) {
    return apiClient.delete(
      `${API_ENDPOINTS.WATCHLIST.ITEMS}/${itemId}`,
      { id: watchlistId }
    );
  },

  /**
   * Remove stock by symbol from watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string} symbol - Stock symbol
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/watchlist/123/items?symbol=AAPL
   * Expected response: { success: true }
   */
  async removeStockBySymbol(watchlistId, symbol) {
    return apiClient.delete(API_ENDPOINTS.WATCHLIST.ITEMS, {
      id: watchlistId,
      symbol,
    });
  },

  /**
   * Remove multiple stocks from watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string[]} itemIds - Array of item IDs
   * @returns {Promise<{success: boolean, data?: {removed: number}, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/watchlist/123/items/bulk
   * Request body: { item_ids: ["1", "2", "3"] }
   * Expected response: { removed: 3 }
   */
  async removeStocks(watchlistId, itemIds) {
    return apiClient.post(
      `${API_ENDPOINTS.WATCHLIST.ITEMS}/bulk-delete`,
      { item_ids: itemIds },
      { params: { id: watchlistId } }
    );
  },

  /**
   * Check if stock is in watchlist
   *
   * @param {string} watchlistId - Watchlist ID
   * @param {string} symbol - Stock symbol
   * @returns {Promise<{success: boolean, data?: {inWatchlist: boolean, itemId?: string}, error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist/123/items/check?symbol=AAPL
   * Expected response: { inWatchlist: true, itemId: "456" }
   */
  async isStockInWatchlist(watchlistId, symbol) {
    return apiClient.get(`${API_ENDPOINTS.WATCHLIST.ITEMS}/check`, {
      id: watchlistId,
      symbol,
    });
  },

  /**
   * Check if stock is in any watchlist
   *
   * @param {string} symbol - Stock symbol
   * @returns {Promise<{success: boolean, data?: {watchlists: array}, error?: object}>}
   *
   * Example backend endpoint: GET /api/watchlist/check?symbol=AAPL
   * Expected response: { watchlists: [{ id: "1", name: "Tech Stocks" }, ...] }
   */
  async findStockInWatchlists(symbol) {
    return apiClient.get(`${API_ENDPOINTS.WATCHLIST.LIST}/check`, {
      symbol,
    });
  },
};

export default watchlistService;
