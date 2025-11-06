/**
 * Watchlist Page
 *
 * Manage and view stock watchlists with real-time price updates
 */

import React, { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WatchlistSelector from '../components/watchlist/WatchlistSelector';
import WatchlistStocks from '../components/watchlist/WatchlistStocks';
import AddStockModal from '../components/watchlist/AddStockModal';

export default function Watchlist() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const {
    watchlists,
    currentWatchlist,
    items,
    loading,
    error,
    selectWatchlist,
    createWatchlist,
    deleteWatchlist,
    addStock,
    removeStockBySymbol,
    updateItemNotes,
  } = useWatchlist();

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) return;

    setIsCreating(true);
    try {
      await createWatchlist({
        name: newWatchlistName,
        description: newWatchlistDescription,
      });
      setShowCreateModal(false);
      setNewWatchlistName('');
      setNewWatchlistDescription('');
    } catch (err) {
      console.error('Failed to create watchlist:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddStock = async (symbol, notes) => {
    const response = await addStock(symbol, notes);
    if (!response.success) {
      console.error('Failed to add stock:', response.error);
    }
  };

  const handleRemoveStock = async (symbol) => {
    if (window.confirm(`Remove ${symbol} from watchlist?`)) {
      await removeStockBySymbol(symbol);
    }
  };

  const handleUpdateNotes = async (symbol, notes) => {
    const item = items.find((i) => i.symbol === symbol);
    if (item) {
      await updateItemNotes(item.id, notes);
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Watchlist
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track and monitor your favorite stocks
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <WatchlistSelector
                    watchlists={watchlists}
                    currentWatchlist={currentWatchlist}
                    onSelect={selectWatchlist}
                    onCreateNew={() => setShowCreateModal(true)}
                    onDelete={deleteWatchlist}
                  />
                  <button
                    onClick={() => setShowAddModal(true)}
                    disabled={!currentWatchlist}
                    className="btn bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    Add Stock
                  </button>
                </div>
              </div>
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

            {/* No watchlist selected state */}
            {!currentWatchlist && !loading && watchlists.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60">
                <div className="p-12 text-center">
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    No Watchlists Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first watchlist to start tracking stocks
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    Create Watchlist
                  </button>
                </div>
              </div>
            ) : (
              /* Stocks list */
              <WatchlistStocks
                stocks={items}
                loading={loading}
                onRemove={handleRemoveStock}
                onUpdateNotes={handleUpdateNotes}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStock}
      />

      {/* Create Watchlist Modal */}
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-watchlist-modal-title"
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                  <h3
                    id="create-watchlist-modal-title"
                    className="text-lg font-semibold text-gray-800 dark:text-gray-100"
                  >
                    Create New Watchlist
                  </h3>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <label
                      htmlFor="watchlist-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="watchlist-name"
                      type="text"
                      value={newWatchlistName}
                      onChange={(e) => setNewWatchlistName(e.target.value)}
                      placeholder="My Tech Stocks"
                      className="form-input w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newWatchlistName.trim()) {
                          handleCreateWatchlist();
                        }
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="watchlist-description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="watchlist-description"
                      value={newWatchlistDescription}
                      onChange={(e) => setNewWatchlistDescription(e.target.value)}
                      placeholder="Description of this watchlist..."
                      rows={3}
                      className="form-textarea w-full"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewWatchlistName('');
                        setNewWatchlistDescription('');
                      }}
                      className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                      disabled={isCreating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWatchlist}
                      disabled={!newWatchlistName.trim() || isCreating}
                      className="btn-sm bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
