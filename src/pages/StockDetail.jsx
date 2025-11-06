/**
 * Stock Detail Page
 *
 * Displays comprehensive stock information including:
 * - Price chart with timeframes
 * - Key statistics
 * - Company fundamentals
 * - News feed
 * - Actions (buy, add to watchlist)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { stockService } from '../services';
import { useWatchlist } from '../context';
import {
  StockPriceChart,
  StockStats,
  StockFundamentals,
  StockNews,
  PriceChangeIndicator,
} from '../components/stock';
import { formatStockPrice } from '../utils/stockUtils';
import { getStockData } from '../utils/mockData';

export default function StockDetail() {
  const { symbol } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quote, setQuote] = useState(null);
  const [fundamentals, setFundamentals] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, fundamentals, news

  const { addStock, isStockInWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState([]);

  useEffect(() => {
    if (symbol) {
      fetchStockData();
      checkWatchlistStatus();
    }
  }, [symbol]);

  const fetchStockData = async () => {
    setLoading(true);

    try {
      // Fetch quote
      const quoteResponse = await stockService.getQuote(symbol);
      if (quoteResponse.success) {
        setQuote(quoteResponse.data);
      } else {
        // Try mock data
        const mockData = getStockData(symbol);
        if (mockData) {
          setQuote(mockData.quote);
          setFundamentals(mockData.fundamentals);
          setNews(mockData.news);
          console.log(`📊 Using mock data for ${symbol}`);
          setLoading(false);
          return;
        }
      }

      // Fetch fundamentals
      const fundamentalsResponse = await stockService.getFundamentals(symbol);
      if (fundamentalsResponse.success) {
        setFundamentals(fundamentalsResponse.data);
      }

      // Fetch news
      const newsResponse = await stockService.getNews(symbol, 10);
      if (newsResponse.success) {
        setNews(newsResponse.data.articles || newsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
      // Try mock data as fallback
      const mockData = getStockData(symbol);
      if (mockData) {
        setQuote(mockData.quote);
        setFundamentals(mockData.fundamentals);
        setNews(mockData.news);
        console.log(`📊 Using mock data for ${symbol} (API failed)`);
      }
    }

    setLoading(false);
  };

  const checkWatchlistStatus = async () => {
    const watchlists = await isStockInWatchlist(symbol);
    setInWatchlist(watchlists);
  };

  const handleAddToWatchlist = async () => {
    const response = await addStock(symbol);
    if (response.success) {
      await checkWatchlistStatus();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'fundamentals', label: 'Fundamentals' },
    { id: 'news', label: 'News' },
  ];

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
            {/* Back Button */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>

            {loading && !quote ? (
              /* Loading State */
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <svg
                    className="animate-spin w-12 h-12 fill-current text-gray-400 mx-auto mb-4"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                  </svg>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    Loading {symbol}...
                  </div>
                </div>
              </div>
            ) : quote ? (
              <>
                {/* Stock Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Symbol, Name, Price */}
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                          {symbol}
                        </h1>
                        {fundamentals?.name && (
                          <span className="text-lg text-gray-500 dark:text-gray-400">
                            {fundamentals.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                          {formatStockPrice(quote.price)}
                        </div>
                        <PriceChangeIndicator
                          change={quote.change}
                          changePercent={quote.changePercent}
                          size="lg"
                        />
                      </div>
                      {fundamentals?.sector && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {fundamentals.sector}
                          </span>
                          {fundamentals.industry && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              • {fundamentals.industry}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleAddToWatchlist}
                        disabled={inWatchlist.length > 0}
                        className={`btn ${
                          inWatchlist.length > 0
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-violet-500 hover:bg-violet-600 text-white'
                        }`}
                      >
                        {inWatchlist.length > 0 ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            In Watchlist
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Add to Watchlist
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200 dark:border-gray-700/60">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`${
                            activeTab === tab.id
                              ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Price Chart */}
                    <StockPriceChart symbol={symbol} />

                    {/* Key Statistics */}
                    <StockStats quote={quote} />
                  </div>
                )}

                {activeTab === 'fundamentals' && (
                  <StockFundamentals fundamentals={fundamentals} />
                )}

                {activeTab === 'news' && (
                  <StockNews news={news} loading={loading} />
                )}
              </>
            ) : (
              /* Error State */
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                    Stock not found
                  </div>
                  <Link to="/" className="text-violet-500 hover:text-violet-600">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
