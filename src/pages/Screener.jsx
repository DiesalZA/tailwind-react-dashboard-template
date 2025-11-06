/**
 * Screener Page
 *
 * Stock screening interface with filters, results, and saved screens
 */

import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import ScreenerFilters from '../components/screener/ScreenerFilters';
import ScreenerResults from '../components/screener/ScreenerResults';
import SavedScreeners from '../components/screener/SavedScreeners';
import stockService from '../services/stockService';

const DEFAULT_FILTERS = {
  priceMin: '',
  priceMax: '',
  marketCap: [],
  volumeMin: '',
  peMin: '',
  peMax: '',
  dividendYieldMin: '',
  changeDayMin: '',
  changeDayMax: '',
  sectors: [],
};

export default function Screener() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedScreeners, setSavedScreeners] = useState([]);
  const { addStock } = useWatchlist();

  // Load saved screeners from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedScreeners');
    if (saved) {
      try {
        setSavedScreeners(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load saved screeners:', err);
      }
    }
  }, []);

  // Save screeners to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedScreeners', JSON.stringify(savedScreeners));
  }, [savedScreeners]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters from filters with validation
      const params = {};

      // Helper function to safely parse and validate numeric values
      const addNumericParam = (key, value, parser = parseFloat) => {
        if (value) {
          const parsed = parser(value);
          if (!isNaN(parsed)) {
            params[key] = parsed;
          }
        }
      };

      // Add numeric filters with validation
      addNumericParam('priceMin', filters.priceMin);
      addNumericParam('priceMax', filters.priceMax);
      addNumericParam('volumeMin', filters.volumeMin, parseInt);
      addNumericParam('peMin', filters.peMin);
      addNumericParam('peMax', filters.peMax);
      addNumericParam('dividendYieldMin', filters.dividendYieldMin);
      addNumericParam('changeDayMin', filters.changeDayMin);
      addNumericParam('changeDayMax', filters.changeDayMax);

      // Add array filters
      if (filters.marketCap?.length) params.marketCap = filters.marketCap.join(',');
      if (filters.sectors?.length) params.sectors = filters.sectors.join(',');

      // Call the stock service search endpoint
      const response = await stockService.search('', 100); // This would be a screener endpoint

      // For now, this will likely fail as the endpoint doesn't exist yet
      // In production, you'd have a dedicated screener endpoint
      setResults(response.data || []);
    } catch (err) {
      console.error('Screener search failed:', err);
      setError(err.message || 'Failed to perform stock screen. Please try again.');

      // For demo purposes, set some mock data
      setResults([
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 178.45,
          change: { value: 2.34, percent: 1.33 },
          volume: 52847392,
          marketCap: 2780000000000,
          pe: 28.5,
          dividendYield: 0.52,
          sector: 'Technology',
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 378.91,
          change: { value: -1.23, percent: -0.32 },
          volume: 23456789,
          marketCap: 2810000000000,
          pe: 32.1,
          dividendYield: 0.79,
          sector: 'Technology',
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 140.23,
          change: { value: 3.45, percent: 2.52 },
          volume: 28934567,
          marketCap: 1750000000000,
          pe: 25.4,
          dividendYield: 0.0,
          sector: 'Communication Services',
        },
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          price: 178.32,
          change: { value: 1.89, percent: 1.07 },
          volume: 45678901,
          marketCap: 1840000000000,
          pe: 68.2,
          dividendYield: 0.0,
          sector: 'Consumer Cyclical',
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          price: 495.67,
          change: { value: 8.23, percent: 1.69 },
          volume: 38765432,
          marketCap: 1220000000000,
          pe: 58.9,
          dividendYield: 0.04,
          sector: 'Technology',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setResults([]);
    setError(null);
  };

  const handleLoadScreen = (loadedFilters) => {
    setFilters(loadedFilters);
    setError(null);
  };

  const handleSaveScreen = (screen) => {
    setSavedScreeners([...savedScreeners, screen]);
  };

  const handleDeleteScreen = (index) => {
    setSavedScreeners(savedScreeners.filter((_, i) => i !== index));
  };

  const handleAddToWatchlist = async (symbol) => {
    try {
      await addStock(symbol);
      // Show success message (you could add a toast notification here)
      console.log(`Added ${symbol} to watchlist`);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Stock Screener
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Filter and discover stocks based on your criteria
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                      Using demo data
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Layout */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left sidebar - Filters and Saved Screens */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                {/* Filters */}
                <ScreenerFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleReset}
                  onSearch={handleSearch}
                />

                {/* Saved Screens */}
                <SavedScreeners
                  savedScreeners={savedScreeners}
                  currentFilters={filters}
                  onLoad={handleLoadScreen}
                  onSave={handleSaveScreen}
                  onDelete={handleDeleteScreen}
                />
              </div>

              {/* Main content - Results */}
              <div className="col-span-12 lg:col-span-9">
                <ScreenerResults
                  results={results}
                  loading={loading}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
