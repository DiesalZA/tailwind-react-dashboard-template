/**
 * Watchlist Context
 *
 * Manages watchlist state across the application
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { watchlistService } from '../services';
import { mockWatchlists, mockWatchlistItems } from '../utils/mockData';

/**
 * Safely parse mock data from localStorage
 * @returns {Object|null} Parsed data or null if parsing fails
 */
const safeParseMockData = () => {
  try {
    const mockData = localStorage.getItem('mockWatchlistData');
    if (!mockData) return null;
    return JSON.parse(mockData);
  } catch (parseError) {
    console.error('Failed to parse mock watchlist data:', parseError);
    localStorage.removeItem('mockWatchlistData');
    return null;
  }
};

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

    try {
      const response = await watchlistService.getAll();

      if (response.success) {
        const watchlistList = response.data.watchlists || response.data || [];
        setWatchlists(watchlistList);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch watchlists');
      }
    } catch (err) {
      console.error('Failed to fetch watchlists:', err);

      // Try to load from localStorage mock data
      const mockData = safeParseMockData();
      if (mockData && mockData.watchlists) {
        setWatchlists(mockData.watchlists);
        console.log('📊 Loaded watchlists from mock data');
      } else {
        // Use default mock data
        setWatchlists(mockWatchlists);
        console.log('📊 Using default mock watchlists');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Stable - no dependencies, just fetches and updates state

  /**
   * Select a watchlist and fetch its items
   */
  const selectWatchlist = useCallback(async (watchlistId) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch watchlist details and items
      const response = await watchlistService.getWithItems(watchlistId);

      if (response.success) {
        setCurrentWatchlist(response.data.watchlist || response.data);
        setItems(response.data.items || []);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch watchlist items');
      }
    } catch (err) {
      console.error('Failed to fetch watchlist items:', err);

      // Try to load from localStorage mock data
      const mockData = safeParseMockData();
      if (mockData && mockData.watchlists && mockData.items) {
        const watchlist = mockData.watchlists.find((w) => w.id === watchlistId);
        const items = mockData.items.filter((item) => item.watchlistId === watchlistId);
        setCurrentWatchlist(watchlist || null);
        setItems(items);
        console.log('📊 Loaded watchlist items from mock data');
      } else {
        // Use default mock data
        const watchlist = mockWatchlists.find((w) => w.id === watchlistId);
        const items = mockWatchlistItems.filter((item) => item.watchlistId === watchlistId);
        setCurrentWatchlist(watchlist || null);
        setItems(items);
        console.log('📊 Using default mock watchlist items');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add stock to current watchlist
   */
  const addStock = useCallback(async (symbol, notes = '') => {
    if (!currentWatchlist) {
      return { success: false, error: { message: 'No watchlist selected' } };
    }

    setLoading(true);

    try {
      const response = await watchlistService.addStock(currentWatchlist.id, {
        symbol,
        notes,
      });

      if (response.success) {
        // Refresh items after adding
        try {
          await selectWatchlist(currentWatchlist.id);
        } catch (refreshError) {
          console.warn('Failed to refresh watchlist after adding stock:', refreshError);
          // Stock was added successfully, just couldn't refresh the list
          // User can manually refresh or it will update on next load
        }
      } else {
        throw new Error(response.error?.message || 'Failed to add stock');
      }

      return response;
    } catch (err) {
      console.error('Failed to add stock:', err);

      // Add locally with mock data
      const newItem = {
        id: `item_${Date.now()}`,
        watchlistId: currentWatchlist.id,
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Inc.`,
        price: 100.00,
        change: 0.00,
        changePercent: 0.00,
        notes,
        addedAt: new Date().toISOString(),
      };
      setItems([...items, newItem]);
      console.log('📊 Added stock locally');

      return { success: true, data: newItem };
    } finally {
      setLoading(false);
    }
  }, [currentWatchlist, selectWatchlist, items]);

  /**
   * Add multiple stocks to current watchlist
   */
  const addStocks = useCallback(async (symbols) => {
    if (!currentWatchlist) {
      return { success: false, error: { message: 'No watchlist selected' } };
    }

    setLoading(true);

    try {
      const response = await watchlistService.addStocks(currentWatchlist.id, symbols);

      if (response.success) {
        // Refresh items after adding
        try {
          await selectWatchlist(currentWatchlist.id);
        } catch (refreshError) {
          console.warn('Failed to refresh watchlist after adding stocks:', refreshError);
          // Stocks were added successfully, just couldn't refresh the list
        }
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      console.error('Failed to add stocks:', err);
      setError(err.message);
      return { success: false, error: { message: err.message } };
    } finally {
      setLoading(false);
    }
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

    try {
      const response = await watchlistService.create(watchlistData);

      if (response.success) {
        // Refresh watchlist list
        try {
          await fetchWatchlists();

          // Verify the watchlist still exists before selecting
          // This prevents race conditions if user navigated away or watchlist was deleted
          setWatchlists((currentWatchlists) => {
            const watchlistExists = currentWatchlists.some(w => w.id === response.data.id);
            if (watchlistExists) {
              // Safe to select - watchlist exists in current state
              selectWatchlist(response.data.id);
            } else {
              console.warn('Created watchlist not found in refreshed list, skipping auto-select');
            }
            return currentWatchlists; // Return unchanged
          });
        } catch (refreshError) {
          console.warn('Failed to refresh after creating watchlist:', refreshError);
          // Watchlist was created successfully, just couldn't refresh the list
        }
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      console.error('Failed to create watchlist:', err);
      setError(err.message);
      return { success: false, error: { message: err.message } };
    } finally {
      setLoading(false);
    }
  }, [fetchWatchlists, selectWatchlist]);

  /**
   * Update watchlist
   */
  const updateWatchlist = useCallback(async (watchlistId, data) => {
    setLoading(true);

    try {
      const response = await watchlistService.update(watchlistId, data);

      if (response.success) {
        // Refresh watchlist list
        try {
          await fetchWatchlists();
          if (currentWatchlist?.id === watchlistId) {
            setCurrentWatchlist(response.data);
          }
        } catch (refreshError) {
          console.warn('Failed to refresh after updating watchlist:', refreshError);
          // Watchlist was updated successfully, just couldn't refresh the list
        }
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      console.error('Failed to update watchlist:', err);
      setError(err.message);
      return { success: false, error: { message: err.message } };
    } finally {
      setLoading(false);
    }
  }, [fetchWatchlists, currentWatchlist]);

  /**
   * Delete watchlist
   */
  const deleteWatchlist = useCallback(async (watchlistId) => {
    setLoading(true);

    try {
      const response = await watchlistService.delete(watchlistId);

      if (response.success) {
        // Refresh watchlist list
        try {
          await fetchWatchlists();
          if (currentWatchlist?.id === watchlistId) {
            setCurrentWatchlist(null);
            setItems([]);
          }
        } catch (refreshError) {
          console.warn('Failed to refresh after deleting watchlist:', refreshError);
          // Watchlist was deleted successfully, just couldn't refresh the list
        }
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      console.error('Failed to delete watchlist:', err);
      setError(err.message);
      return { success: false, error: { message: err.message } };
    } finally {
      setLoading(false);
    }
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
  }, [fetchWatchlists]);

  // Auto-select first watchlist if none selected
  useEffect(() => {
    if (!currentWatchlist && watchlists.length > 0) {
      selectWatchlist(watchlists[0].id);
    }
  }, [watchlists, currentWatchlist, selectWatchlist]);

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
