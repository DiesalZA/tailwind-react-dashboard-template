/**
 * Portfolio Context
 *
 * Manages portfolio state across the application
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services';

const PortfolioContext = createContext({
  portfolios: [],
  currentPortfolio: null,
  holdings: [],
  transactions: [],
  performance: null,
  loading: false,
  error: null,
  fetchPortfolios: () => {},
  selectPortfolio: () => {},
  addTransaction: () => {},
  refreshHoldings: () => {},
});

export default function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all portfolios for the current user
   */
  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await portfolioService.getAll();

    if (response.success) {
      const portfolioList = response.data.portfolios || response.data || [];
      setPortfolios(portfolioList);

      // Auto-select first portfolio if none selected
      // Note: Using currentPortfolio from closure is safe here since this only runs once on mount
      if (!currentPortfolio && portfolioList.length > 0) {
        selectPortfolio(portfolioList[0].id);
      }
    } else {
      setError(response.error);
    }

    setLoading(false);
  }, [selectPortfolio]); // selectPortfolio is stable, so fetchPortfolios is stable

  /**
   * Select a portfolio and fetch its holdings
   */
  const selectPortfolio = useCallback(async (portfolioId) => {
    setLoading(true);
    setError(null);

    // Fetch portfolio details
    const portfolioResponse = await portfolioService.getById(portfolioId);

    if (!portfolioResponse.success) {
      setError(portfolioResponse.error);
      setLoading(false);
      return;
    }

    setCurrentPortfolio(portfolioResponse.data);

    // Fetch holdings
    const holdingsResponse = await portfolioService.getHoldings(portfolioId);

    if (holdingsResponse.success) {
      setHoldings(holdingsResponse.data.holdings || holdingsResponse.data || []);
    } else {
      setError(holdingsResponse.error);
    }

    setLoading(false);
  }, []);

  /**
   * Fetch transactions for current portfolio
   */
  const fetchTransactions = useCallback(async (options = {}) => {
    if (!currentPortfolio) return;

    setLoading(true);
    const response = await portfolioService.getTransactions(currentPortfolio.id, options);

    if (response.success) {
      setTransactions(response.data.transactions || response.data || []);
    } else {
      setError(response.error);
    }

    setLoading(false);
  }, [currentPortfolio]);

  /**
   * Add a transaction and refresh holdings
   */
  const addTransaction = useCallback(async (transactionData) => {
    if (!currentPortfolio) {
      return { success: false, error: { message: 'No portfolio selected' } };
    }

    setLoading(true);
    const response = await portfolioService.addTransaction(
      currentPortfolio.id,
      transactionData
    );

    if (response.success) {
      // Refresh holdings after transaction
      await selectPortfolio(currentPortfolio.id);
      await fetchTransactions();
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentPortfolio, selectPortfolio, fetchTransactions]);

  /**
   * Refresh holdings for current portfolio
   */
  const refreshHoldings = useCallback(async () => {
    if (!currentPortfolio) return;

    const response = await portfolioService.getHoldings(currentPortfolio.id);

    if (response.success) {
      setHoldings(response.data.holdings || response.data || []);
    }
  }, [currentPortfolio]);

  /**
   * Fetch portfolio performance
   */
  const fetchPerformance = useCallback(async (period = '1M') => {
    if (!currentPortfolio) return;

    const response = await portfolioService.getPerformance(currentPortfolio.id, period);

    if (response.success) {
      setPerformance(response.data);
    }
  }, [currentPortfolio]);

  /**
   * Create a new portfolio
   */
  const createPortfolio = useCallback(async (portfolioData) => {
    setLoading(true);
    const response = await portfolioService.create(portfolioData);

    if (response.success) {
      await fetchPortfolios();
      selectPortfolio(response.data.id);
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [fetchPortfolios, selectPortfolio]);

  /**
   * Update transaction
   */
  const updateTransaction = useCallback(async (transactionId, data) => {
    if (!currentPortfolio) return;

    setLoading(true);
    const response = await portfolioService.updateTransaction(
      currentPortfolio.id,
      transactionId,
      data
    );

    if (response.success) {
      await selectPortfolio(currentPortfolio.id);
      await fetchTransactions();
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentPortfolio, selectPortfolio, fetchTransactions]);

  /**
   * Delete transaction
   */
  const deleteTransaction = useCallback(async (transactionId) => {
    if (!currentPortfolio) return;

    setLoading(true);
    const response = await portfolioService.deleteTransaction(
      currentPortfolio.id,
      transactionId
    );

    if (response.success) {
      await selectPortfolio(currentPortfolio.id);
      await fetchTransactions();
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentPortfolio, selectPortfolio, fetchTransactions]);

  // Load portfolios on mount
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const value = {
    portfolios,
    currentPortfolio,
    holdings,
    transactions,
    performance,
    loading,
    error,
    fetchPortfolios,
    selectPortfolio,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshHoldings,
    fetchTransactions,
    fetchPerformance,
    createPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
