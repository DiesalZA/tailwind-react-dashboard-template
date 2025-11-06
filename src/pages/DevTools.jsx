/**
 * Developer Tools Page
 *
 * Utilities for loading mock data and testing
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadMockData, clearMockData } from '../utils/mockData';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

export default function DevTools() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLoadMockData = () => {
    try {
      loadMockData();
      setMessage('✅ Mock data loaded successfully! Navigate to Portfolio page to see it.');

      // Reload the page to trigger context updates
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('❌ Error loading mock data: ' + error.message);
    }
  };

  const handleClearMockData = () => {
    try {
      clearMockData();
      setMessage('🗑️ Mock data cleared successfully!');

      // Reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('❌ Error clearing mock data: ' + error.message);
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
                Developer Tools
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Load mock data to test the application
              </p>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-8 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Mock Data Management
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Use these tools to populate the application with sample data for testing and demonstration purposes.
              </p>

              {message && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
                  <p className="text-sm text-violet-800 dark:text-violet-300">
                    {message}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <button
                    onClick={handleLoadMockData}
                    className="btn bg-violet-500 hover:bg-violet-600 text-white w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9 0H5a2 2 0 0 0-2 2v1H1.5a1 1 0 0 0 0 2h.75v9a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2V5h.75a1 1 0 1 0 0-2H13V2a2 2 0 0 0-2-2ZM5 2h4v1H5V2Zm6.5 11a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5V5h7v8Z" />
                    </svg>
                    <span className="ml-2">Load Mock Data</span>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Loads sample portfolios, holdings, transactions, and watchlists
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleClearMockData}
                    className="btn bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                    </svg>
                    <span className="ml-2">Clear Mock Data</span>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Removes all mock data from localStorage
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  What's included:
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 2 portfolios (Growth & Dividend)</li>
                  <li>• 6 stock holdings (AAPL, MSFT, GOOGL, NVDA, AMZN, TSLA)</li>
                  <li>• 8 transactions (buys, sells, dividends)</li>
                  <li>• 2 watchlists with 3 stocks</li>
                  <li>• Sample stock data (AAPL quote, fundamentals, news)</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate('/portfolio')}
                  className="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                >
                  Go to Portfolio
                </button>
                <button
                  onClick={() => navigate('/stock/AAPL')}
                  className="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                >
                  View AAPL Stock
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
