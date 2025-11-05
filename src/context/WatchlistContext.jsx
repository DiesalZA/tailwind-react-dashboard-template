/**
 * Watchlist Context
 *
 * Manages watchlist state across the application
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { watchlistService } from '../services';

const WatchlistContext = createContext({
  watchlists: [],
  currentWatchlist: null,
  items: [],
  loading: false,
  error: null,
  fetchWatchlists: () => {},
  selectWatchlist: () => {},
  addStock: () => {},
  removeStock: () => {},
  refreshItems: () => {},
});

export default function WatchlistProvider({ children }) {
  const [watchlists, setWatchlists] = useState([]);
  const [currentWatchlist, setCurrentWatchlist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all watchlists for the current user
   */
  const fetchWatchlists = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await watchlistService.getAll();

    if (response.success) {
      const watchlistList = response.data.watchlists || response.data || [];
      setWatchlists(watchlistList);

      // Auto-select first watchlist if none selected
      if (!currentWatchlist && watchlistList.length > 0) {
        selectWatchlist(watchlistList[0].id);
      }
    } else {
      setError(response.error);
    }

    setLoading(false);
  }, [currentWatchlist]);

  /**
   * Select a watchlist and fetch its items
   */
  const selectWatchlist = useCallback(async (watchlistId) => {
    setLoading(true);
    setError(null);

    // Fetch watchlist details and items
    const response = await watchlistService.getWithItems(watchlistId);

    if (response.success) {
      setCurrentWatchlist(response.data.watchlist || response.data);
      setItems(response.data.items || []);
    } else {
      setError(response.error);
    }

    setLoading(false);
  }, []);

  /**
   * Add stock to current watchlist
   */
  const addStock = useCallback(async (symbol, notes = '') => {
    if (!currentWatchlist) {
      return { success: false, error: { message: 'No watchlist selected' } };
    }

    setLoading(true);
    const response = await watchlistService.addStock(currentWatchlist.id, {
      symbol,
      notes,
    });

    if (response.success) {
      // Refresh items after adding
      await selectWatchlist(currentWatchlist.id);
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentWatchlist, selectWatchlist]);

  /**
   * Add multiple stocks to current watchlist
   */
  const addStocks = useCallback(async (symbols) => {
    if (!currentWatchlist) {
      return { success: false, error: { message: 'No watchlist selected' } };
    }

    setLoading(true);
    const response = await watchlistService.addStocks(currentWatchlist.id, symbols);

    if (response.success) {
      await selectWatchlist(currentWatchlist.id);
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentWatchlist, selectWatchlist]);

  /**
   * Remove stock from current watchlist
   */
  const removeStock = useCallback(async (itemId) => {
    if (!currentWatchlist) {
      return { success: false, error: { message: 'No watchlist selected' } };
    }

    setLoading(true);
    const response = await watchlistService.removeStock(currentWatchlist.id, itemId);

    if (response.success) {
      // Remove item from local state immediately
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentWatchlist]);

  /**
   * Remove stock by symbol
   */
  const removeStockBySymbol = useCallback(async (symbol) => {
    if (!currentWatchlist) return;

    setLoading(true);
    const response = await watchlistService.removeStockBySymbol(
      currentWatchlist.id,
      symbol
    );

    if (response.success) {
      setItems(prevItems => prevItems.filter(item => item.symbol !== symbol));
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentWatchlist]);

  /**
   * Update watchlist item notes
   */
  const updateItemNotes = useCallback(async (itemId, notes) => {
    if (!currentWatchlist) return;

    setLoading(true);
    const response = await watchlistService.updateItem(currentWatchlist.id, itemId, {
      notes,
    });

    if (response.success) {
      // Update item in local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, notes } : item
        )
      );
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [currentWatchlist]);

  /**
   * Refresh items for current watchlist
   */
  const refreshItems = useCallback(async () => {
    if (!currentWatchlist) return;

    const response = await watchlistService.getItems(currentWatchlist.id);

    if (response.success) {
      setItems(response.data.items || response.data || []);
    }
  }, [currentWatchlist]);

  /**
   * Create a new watchlist
   */
  const createWatchlist = useCallback(async (watchlistData) => {
    setLoading(true);
    const response = await watchlistService.create(watchlistData);

    if (response.success) {
      await fetchWatchlists();
      selectWatchlist(response.data.id);
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [fetchWatchlists, selectWatchlist]);

  /**
   * Update watchlist
   */
  const updateWatchlist = useCallback(async (watchlistId, data) => {
    setLoading(true);
    const response = await watchlistService.update(watchlistId, data);

    if (response.success) {
      await fetchWatchlists();
      if (currentWatchlist?.id === watchlistId) {
        setCurrentWatchlist(response.data);
      }
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [fetchWatchlists, currentWatchlist]);

  /**
   * Delete watchlist
   */
  const deleteWatchlist = useCallback(async (watchlistId) => {
    setLoading(true);
    const response = await watchlistService.delete(watchlistId);

    if (response.success) {
      await fetchWatchlists();
      if (currentWatchlist?.id === watchlistId) {
        setCurrentWatchlist(null);
        setItems([]);
      }
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  }, [fetchWatchlists, currentWatchlist]);

  /**
   * Check if stock is in any watchlist
   */
  const isStockInWatchlist = useCallback(async (symbol) => {
    const response = await watchlistService.findStockInWatchlists(symbol);

    if (response.success) {
      return response.data.watchlists || [];
    }

    return [];
  }, []);

  // Load watchlists on mount
  useEffect(() => {
    fetchWatchlists();
  }, []);

  const value = {
    watchlists,
    currentWatchlist,
    items,
    loading,
    error,
    fetchWatchlists,
    selectWatchlist,
    addStock,
    addStocks,
    removeStock,
    removeStockBySymbol,
    updateItemNotes,
    refreshItems,
    createWatchlist,
    updateWatchlist,
    deleteWatchlist,
    isStockInWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
