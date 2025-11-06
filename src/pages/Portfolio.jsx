/**
 * Portfolio Page
 *
 * Main portfolio management interface showing holdings, transactions, and performance
 */

import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import TransactionHistory from '../components/portfolio/TransactionHistory';
import DropdownFull from '../components/DropdownFull';

export default function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    portfolios,
    currentPortfolio,
    holdings,
    transactions,
    loading,
    error,
    selectPortfolio,
    fetchPortfolios,
    refreshHoldings,
  } = usePortfolio();

  // Initial load
  useEffect(() => {
    if (portfolios.length === 0) {
      fetchPortfolios();
    }
  }, [portfolios.length, fetchPortfolios]);

  // Refresh holdings when portfolio changes
  useEffect(() => {
    if (currentPortfolio?.id) {
      refreshHoldings();
    }
  }, [currentPortfolio?.id, refreshHoldings]);

  // Handle portfolio selection from dropdown
  const handlePortfolioChange = (portfolioId) => {
    selectPortfolio(portfolioId);
  };

  // Get portfolio options for dropdown
  const portfolioOptions = portfolios.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
  }));

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
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Portfolio
                </h1>
              </div>

              {/* Right: Portfolio selector and actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Portfolio selector */}
                {portfolios.length > 0 && (
                  <DropdownFull
                    options={portfolioOptions.map((p) => ({
                      id: p.id,
                      period: p.name,
                    }))}
                    selected={currentPortfolio?.id || portfolios[0]?.id}
                    setSelected={(id) => handlePortfolioChange(id)}
                  />
                )}

                {/* Add Transaction button */}
                <button className="btn bg-violet-500 hover:bg-violet-600 text-white">
                  <svg
                    className="fill-current shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Add Transaction</span>
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-red-800 dark:text-red-300">
                    {error}
                  </span>
                </div>
              </div>
            )}

            {/* No portfolios state */}
            {!loading && portfolios.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-12">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    No Portfolios Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first portfolio to start tracking your investments
                  </p>
                  <button className="btn bg-violet-500 hover:bg-violet-600 text-white">
                    <svg
                      className="fill-current shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Create Portfolio</span>
                  </button>
                </div>
              </div>
            )}

            {/* Portfolio content */}
            {portfolios.length > 0 && currentPortfolio && (
              <div className="space-y-6">
                {/* Portfolio Summary */}
                <PortfolioSummary portfolio={currentPortfolio} />

                {/* Holdings Table */}
                <HoldingsTable
                  holdings={holdings}
                  loading={loading}
                />

                {/* Transaction History */}
                <TransactionHistory
                  transactions={transactions?.slice(0, 10) || []}
                  loading={loading}
                />

                {/* View All Transactions Link */}
                {transactions && transactions.length > 10 && (
                  <div className="text-center">
                    <button className="text-sm text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-500 font-medium">
                      View All Transactions →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
