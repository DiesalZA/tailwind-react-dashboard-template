/**
 * Mock Data for Development and Testing
 *
 * This file contains sample data to populate the application
 * for demonstration and development purposes.
 */

export const mockPortfolios = [
  {
    id: 'portfolio-1',
    name: 'Growth Portfolio',
    description: 'High-growth tech stocks',
    totalValue: 125750.50,
    totalCost: 98500.00,
    totalGain: 27250.50,
    totalGainPercent: 27.66,
    todayChange: 1842.30,
    todayChangePercent: 1.49,
    cash: 15000.00,
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'portfolio-2',
    name: 'Dividend Portfolio',
    description: 'Income-focused dividend stocks',
    totalValue: 87300.25,
    totalCost: 85000.00,
    totalGain: 2300.25,
    totalGainPercent: 2.71,
    todayChange: -234.50,
    todayChangePercent: -0.27,
    cash: 5000.00,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

export const mockHoldings = [
  {
    id: 'holding-1',
    portfolioId: 'portfolio-1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    averageCost: 150.25,
    totalCost: 7512.50,
    currentPrice: 178.45,
    currentValue: 8922.50,
    gain: 1410.00,
    gainPercent: 18.77,
    allocation: 7.09,
  },
  {
    id: 'holding-2',
    portfolioId: 'portfolio-1',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 75,
    averageCost: 320.50,
    totalCost: 24037.50,
    currentPrice: 378.91,
    currentValue: 28418.25,
    gain: 4380.75,
    gainPercent: 18.23,
    allocation: 22.59,
  },
  {
    id: 'holding-3',
    portfolioId: 'portfolio-1',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 100,
    averageCost: 125.00,
    totalCost: 12500.00,
    currentPrice: 140.23,
    currentValue: 14023.00,
    gain: 1523.00,
    gainPercent: 12.18,
    allocation: 11.15,
  },
  {
    id: 'holding-4',
    portfolioId: 'portfolio-1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 40,
    averageCost: 420.00,
    totalCost: 16800.00,
    currentPrice: 495.67,
    currentValue: 19826.80,
    gain: 3026.80,
    gainPercent: 18.02,
    allocation: 15.76,
  },
  {
    id: 'holding-5',
    portfolioId: 'portfolio-1',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    shares: 120,
    averageCost: 145.00,
    totalCost: 17400.00,
    currentPrice: 178.32,
    currentValue: 21398.40,
    gain: 3998.40,
    gainPercent: 22.98,
    allocation: 17.01,
  },
  {
    id: 'holding-6',
    portfolioId: 'portfolio-1',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 30,
    averageCost: 210.00,
    totalCost: 6300.00,
    currentPrice: 242.50,
    currentValue: 7275.00,
    gain: 975.00,
    gainPercent: 15.48,
    allocation: 5.78,
  },
];

export const mockTransactions = [
  {
    id: 'tx-1',
    portfolioId: 'portfolio-1',
    symbol: 'AAPL',
    type: 'buy',
    shares: 25,
    price: 145.50,
    amount: 3637.50,
    fees: 0.00,
    date: '2024-11-01T10:30:00.000Z',
    notes: 'Adding to position',
  },
  {
    id: 'tx-2',
    portfolioId: 'portfolio-1',
    symbol: 'MSFT',
    type: 'buy',
    shares: 15,
    price: 375.20,
    amount: 5628.00,
    fees: 0.00,
    date: '2024-10-28T14:15:00.000Z',
    notes: 'New position',
  },
  {
    id: 'tx-3',
    portfolioId: 'portfolio-1',
    symbol: 'GOOGL',
    type: 'dividend',
    shares: 100,
    price: 0.00,
    amount: 85.00,
    fees: 0.00,
    date: '2024-10-25T09:00:00.000Z',
    notes: 'Quarterly dividend',
  },
  {
    id: 'tx-4',
    portfolioId: 'portfolio-1',
    symbol: 'TSLA',
    type: 'sell',
    shares: 10,
    price: 248.75,
    amount: 2487.50,
    fees: 0.00,
    date: '2024-10-20T11:45:00.000Z',
    notes: 'Taking some profit',
  },
  {
    id: 'tx-5',
    portfolioId: 'portfolio-1',
    symbol: 'NVDA',
    type: 'buy',
    shares: 20,
    price: 485.30,
    amount: 9706.00,
    fees: 0.00,
    date: '2024-10-15T13:20:00.000Z',
    notes: 'Initial purchase',
  },
  {
    id: 'tx-6',
    portfolioId: 'portfolio-1',
    symbol: 'AMZN',
    type: 'buy',
    shares: 60,
    price: 172.40,
    amount: 10344.00,
    fees: 0.00,
    date: '2024-10-10T10:00:00.000Z',
    notes: 'Building position',
  },
  {
    id: 'tx-7',
    portfolioId: 'portfolio-1',
    symbol: 'AAPL',
    type: 'dividend',
    shares: 50,
    price: 0.00,
    amount: 24.50,
    fees: 0.00,
    date: '2024-10-05T09:00:00.000Z',
    notes: 'Quarterly dividend',
  },
  {
    id: 'tx-8',
    portfolioId: 'portfolio-1',
    symbol: 'MSFT',
    type: 'dividend',
    shares: 75,
    price: 0.00,
    amount: 56.25,
    fees: 0.00,
    date: '2024-10-01T09:00:00.000Z',
    notes: 'Quarterly dividend',
  },
];

export const mockWatchlists = [
  {
    id: 'watchlist-1',
    name: 'Tech Stocks',
    description: 'Technology sector watchlist',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'watchlist-2',
    name: 'High Dividend',
    description: 'Stocks with high dividend yields',
    createdAt: '2024-02-15T00:00:00.000Z',
  },
];

export const mockWatchlistItems = [
  {
    id: 'watch-1',
    watchlistId: 'watchlist-1',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 475.23,
    change: 8.45,
    changePercent: 1.81,
    notes: 'Watching for entry point',
    addedAt: '2024-10-15T00:00:00.000Z',
  },
  {
    id: 'watch-2',
    watchlistId: 'watchlist-1',
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 632.18,
    change: -5.32,
    changePercent: -0.83,
    notes: 'Strong Q3 earnings',
    addedAt: '2024-10-20T00:00:00.000Z',
  },
  {
    id: 'watch-3',
    watchlistId: 'watchlist-1',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 142.67,
    change: 3.21,
    changePercent: 2.30,
    notes: 'AI chip competition',
    addedAt: '2024-10-25T00:00:00.000Z',
  },
];

export const mockStockQuote = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 178.45,
  change: 2.34,
  changePercent: 1.33,
  open: 176.50,
  high: 179.20,
  low: 176.10,
  previousClose: 176.11,
  volume: 52847392,
  marketCap: 2780000000000,
  pe: 28.5,
  eps: 6.26,
  dividendYield: 0.52,
  fiftyTwoWeekHigh: 199.62,
  fiftyTwoWeekLow: 164.08,
  averageVolume: 54230000,
  beta: 1.24,
};

export const mockStockFundamentals = {
  symbol: 'AAPL',
  companyName: 'Apple Inc.',
  description:
    'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories. Apple also provides various services including AppleCare, cloud services, digital content, and payment services.',
  ceo: 'Tim Cook',
  employees: 161000,
  sector: 'Technology',
  industry: 'Consumer Electronics',
  website: 'https://www.apple.com',
  headquarters: 'Cupertino, CA',
  founded: '1976',
  marketCap: 2780000000000,
  revenue: 383285000000,
  revenueGrowth: 2.8,
  grossProfit: 169148000000,
  grossMargin: 44.13,
  netIncome: 96995000000,
  netMargin: 25.31,
  pe: 28.5,
  pb: 39.8,
  ps: 7.25,
  debtToEquity: 1.78,
  currentRatio: 0.98,
  quickRatio: 0.95,
  roe: 147.25,
  roa: 22.61,
  dividendYield: 0.52,
  dividendPayoutRatio: 15.0,
};

export const mockStockNews = [
  {
    id: 'news-1',
    title: 'Apple Announces Record Q4 Earnings Beat',
    source: 'CNBC',
    url: '#',
    publishedAt: '2024-11-03T14:30:00.000Z',
    summary:
      'Apple reported better-than-expected Q4 earnings with strong iPhone 15 sales and growing services revenue. The company also announced a $110 billion stock buyback program.',
    sentiment: 'positive',
    image: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Apple+Earnings',
  },
  {
    id: 'news-2',
    title: 'Apple Vision Pro Sales Exceed Expectations in First Month',
    source: 'The Verge',
    url: '#',
    publishedAt: '2024-11-01T10:15:00.000Z',
    summary:
      'Early sales data suggests Apple Vision Pro is outperforming initial forecasts, with strong demand from enterprise customers and developers.',
    sentiment: 'positive',
    image: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Vision+Pro',
  },
  {
    id: 'news-3',
    title: 'Analyst Upgrades Apple to Buy on AI Potential',
    source: 'Bloomberg',
    url: '#',
    publishedAt: '2024-10-30T09:00:00.000Z',
    summary:
      'Major investment bank upgrades Apple citing strong potential for AI integration across product line and services ecosystem growth.',
    sentiment: 'positive',
    image: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Apple+AI',
  },
  {
    id: 'news-4',
    title: 'Apple Faces Regulatory Scrutiny in EU Over App Store Policies',
    source: 'Reuters',
    url: '#',
    publishedAt: '2024-10-28T16:45:00.000Z',
    summary:
      'European Union regulators announce investigation into Apple App Store practices, potentially impacting services revenue.',
    sentiment: 'negative',
    image: 'https://via.placeholder.com/400x200/ef4444/ffffff?text=EU+Investigation',
  },
  {
    id: 'news-5',
    title: 'Apple Expands Manufacturing in India, Diversifying Supply Chain',
    source: 'WSJ',
    url: '#',
    publishedAt: '2024-10-25T11:20:00.000Z',
    summary:
      'Apple announces plans to produce 25% of iPhones in India by 2025, reducing dependence on China manufacturing.',
    sentiment: 'neutral',
    image: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=India+Manufacturing',
  },
];

// Helper function to load mock data into contexts
export function loadMockData() {
  // Store mock portfolios in localStorage for PortfolioContext
  const portfolioData = {
    portfolios: mockPortfolios,
    holdings: mockHoldings,
    transactions: mockTransactions,
  };
  localStorage.setItem('mockPortfolioData', JSON.stringify(portfolioData));

  // Store mock watchlists in localStorage for WatchlistContext
  const watchlistData = {
    watchlists: mockWatchlists,
    items: mockWatchlistItems,
  };
  localStorage.setItem('mockWatchlistData', JSON.stringify(watchlistData));

  console.log('✅ Mock data loaded successfully!');
  console.log('📊 Portfolios:', mockPortfolios.length);
  console.log('📈 Holdings:', mockHoldings.length);
  console.log('💰 Transactions:', mockTransactions.length);
  console.log('⭐ Watchlists:', mockWatchlists.length);

  return {
    portfolios: portfolioData,
    watchlists: watchlistData,
  };
}

// Helper to clear mock data
export function clearMockData() {
  localStorage.removeItem('mockPortfolioData');
  localStorage.removeItem('mockWatchlistData');
  console.log('🗑️ Mock data cleared');
}
