/**
 * Portfolio Service
 *
 * Handles all portfolio-related API calls
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

const portfolioService = {
  /**
   * Get all portfolios for the current user
   *
   * @returns {Promise<{success: boolean, data?: Portfolio[], error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio
   * Expected response: { portfolios: [{ id, name, totalValue, ... }] }
   */
  async getAll() {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.LIST);
  },

  /**
   * Get portfolio by ID
   *
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<{success: boolean, data?: Portfolio, error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/123
   * Expected response: { id, name, totalValue, ... }
   */
  async getById(portfolioId) {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.DETAIL, { id: portfolioId });
  },

  /**
   * Create a new portfolio
   *
   * @param {object} data - Portfolio data
   * @param {string} data.name - Portfolio name
   * @param {string} data.description - Portfolio description
   * @param {number} data.cashBalance - Initial cash balance
   * @param {string} data.currency - Currency code (default: "USD")
   * @returns {Promise<{success: boolean, data?: Portfolio, error?: object}>}
   *
   * Example backend endpoint: POST /api/portfolio
   * Request body: { name, description, cashBalance, currency }
   * Expected response: { id, name, totalValue, ... }
   */
  async create(data) {
    return apiClient.post(API_ENDPOINTS.PORTFOLIO.LIST, data);
  },

  /**
   * Update portfolio
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {object} data - Updated portfolio data
   * @returns {Promise<{success: boolean, data?: Portfolio, error?: object}>}
   *
   * Example backend endpoint: PATCH /api/portfolio/123
   * Request body: { name?, description?, ... }
   * Expected response: { id, name, totalValue, ... }
   */
  async update(portfolioId, data) {
    return apiClient.patch(API_ENDPOINTS.PORTFOLIO.DETAIL, data, {
      params: { id: portfolioId },
    });
  },

  /**
   * Delete portfolio
   *
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/portfolio/123
   * Expected response: { success: true }
   */
  async delete(portfolioId) {
    return apiClient.delete(API_ENDPOINTS.PORTFOLIO.DETAIL, { id: portfolioId });
  },

  /**
   * Get portfolio holdings
   *
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<{success: boolean, data?: Holding[], error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/123/holdings
   * Expected response: { holdings: [{ symbol, shares, avgCost, currentValue, ... }] }
   */
  async getHoldings(portfolioId) {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.HOLDINGS, { id: portfolioId });
  },

  /**
   * Get portfolio transactions
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {object} options - Query options
   * @param {number} options.limit - Number of transactions to return
   * @param {number} options.offset - Offset for pagination
   * @param {string} options.symbol - Filter by stock symbol
   * @param {string} options.type - Filter by transaction type
   * @param {string} options.startDate - Filter by start date (ISO format)
   * @param {string} options.endDate - Filter by end date (ISO format)
   * @returns {Promise<{success: boolean, data?: {transactions: Transaction[], total: number}, error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/123/transactions?limit=50&offset=0
   * Expected response: { transactions: [...], total: 150 }
   */
  async getTransactions(portfolioId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      symbol,
      type,
      startDate,
      endDate,
    } = options;

    const params = { id: portfolioId, limit, offset };

    if (symbol) params.symbol = symbol;
    if (type) params.type = type;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return apiClient.get(API_ENDPOINTS.PORTFOLIO.TRANSACTIONS, params);
  },

  /**
   * Add a transaction to portfolio
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {object} transaction - Transaction data
   * @param {string} transaction.symbol - Stock symbol
   * @param {string} transaction.type - Transaction type ("buy" or "sell")
   * @param {number} transaction.shares - Number of shares
   * @param {number} transaction.price - Price per share
   * @param {number} transaction.fees - Transaction fees (default: 0)
   * @param {string} transaction.date - Transaction date (ISO format)
   * @param {string} transaction.notes - Optional notes
   * @returns {Promise<{success: boolean, data?: Transaction, error?: object}>}
   *
   * Example backend endpoint: POST /api/portfolio/123/transactions
   * Request body: { symbol, type, shares, price, fees, date, notes }
   * Expected response: { id, symbol, type, shares, ... }
   */
  async addTransaction(portfolioId, transaction) {
    return apiClient.post(API_ENDPOINTS.PORTFOLIO.TRANSACTIONS, transaction, {
      params: { id: portfolioId },
    });
  },

  /**
   * Update a transaction
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {string} transactionId - Transaction ID
   * @param {object} data - Updated transaction data
   * @returns {Promise<{success: boolean, data?: Transaction, error?: object}>}
   *
   * Example backend endpoint: PATCH /api/portfolio/123/transactions/456
   * Request body: { shares?, price?, ... }
   * Expected response: { id, symbol, type, shares, ... }
   */
  async updateTransaction(portfolioId, transactionId, data) {
    return apiClient.patch(
      `${API_ENDPOINTS.PORTFOLIO.TRANSACTIONS}/${transactionId}`,
      data,
      { params: { id: portfolioId } }
    );
  },

  /**
   * Delete a transaction
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: DELETE /api/portfolio/123/transactions/456
   * Expected response: { success: true }
   */
  async deleteTransaction(portfolioId, transactionId) {
    return apiClient.delete(
      `${API_ENDPOINTS.PORTFOLIO.TRANSACTIONS}/${transactionId}`,
      { id: portfolioId }
    );
  },

  /**
   * Get portfolio performance data
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {string} period - Time period (e.g., "1D", "1W", "1M", "1Y", "ALL")
   * @returns {Promise<{success: boolean, data?: PortfolioPerformance, error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/123/performance?period=1M
   * Expected response: { portfolioId, period, data: [{ date, value, return, ... }], ... }
   */
  async getPerformance(portfolioId, period = '1M') {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.PERFORMANCE, {
      id: portfolioId,
      period,
    });
  },

  /**
   * Get portfolio summary (includes holdings, allocations, performance)
   *
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<{success: boolean, data?: PortfolioSummary, error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/summary?id=123
   * Expected response: { portfolio, holdings, sectorAllocations, assetAllocations, ... }
   */
  async getSummary(portfolioId) {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.SUMMARY, {
      id: portfolioId,
    });
  },

  /**
   * Get all portfolio summaries for the current user
   *
   * @returns {Promise<{success: boolean, data?: PortfolioSummary[], error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/summary
   * Expected response: { summaries: [{ portfolio, holdings, ... }] }
   */
  async getAllSummaries() {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.SUMMARY);
  },

  /**
   * Import transactions from CSV
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {File} file - CSV file
   * @returns {Promise<{success: boolean, data?: {imported: number, errors: array}, error?: object}>}
   *
   * Example backend endpoint: POST /api/portfolio/123/transactions/import
   * Request: multipart/form-data with CSV file
   * Expected response: { imported: 25, errors: [] }
   */
  async importTransactions(portfolioId, file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(
      `${API_ENDPOINTS.PORTFOLIO.TRANSACTIONS}/import`,
      formData,
      {
        params: { id: portfolioId },
        // Note: Do NOT set Content-Type header manually for FormData
        // The browser will automatically set it with the correct boundary
      }
    );
  },

  /**
   * Export transactions to CSV
   *
   * @param {string} portfolioId - Portfolio ID
   * @param {object} options - Export options
   * @returns {Promise<{success: boolean, data?: Blob, error?: object}>}
   *
   * Example backend endpoint: GET /api/portfolio/123/transactions/export
   * Expected response: CSV file blob
   */
  async exportTransactions(portfolioId, options = {}) {
    const { startDate, endDate, symbol } = options;
    const params = { id: portfolioId };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (symbol) params.symbol = symbol;

    return apiClient.get(
      `${API_ENDPOINTS.PORTFOLIO.TRANSACTIONS}/export`,
      params
    );
  },
};

export default portfolioService;
