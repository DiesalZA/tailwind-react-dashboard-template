/**
 * Portfolio Data Type Definitions
 *
 * These are example data structures that your backend API should return.
 * Adapt these to match your actual Django/FastAPI response schemas.
 */

/**
 * @typedef {Object} Portfolio
 * @property {string} id - Portfolio ID
 * @property {string} name - Portfolio name
 * @property {string} description - Portfolio description
 * @property {number} totalValue - Total portfolio value
 * @property {number} totalCost - Total cost basis
 * @property {number} totalGainLoss - Total gain/loss (absolute)
 * @property {number} totalGainLossPercent - Total gain/loss (percentage)
 * @property {number} dayChange - Day's change (absolute)
 * @property {number} dayChangePercent - Day's change (percentage)
 * @property {number} cashBalance - Cash balance
 * @property {string} currency - Currency code
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} Holding
 * @property {string} id - Holding ID
 * @property {string} portfolioId - Portfolio ID
 * @property {string} symbol - Stock symbol
 * @property {string} name - Stock name
 * @property {number} shares - Number of shares
 * @property {number} avgCost - Average cost per share
 * @property {number} totalCost - Total cost basis
 * @property {number} currentPrice - Current market price
 * @property {number} currentValue - Current market value
 * @property {number} gainLoss - Gain/loss (absolute)
 * @property {number} gainLossPercent - Gain/loss (percentage)
 * @property {number} dayChange - Day's change (absolute)
 * @property {number} dayChangePercent - Day's change (percentage)
 * @property {number} allocation - Portfolio allocation (percentage)
 * @property {string} lastUpdated - ISO timestamp
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction ID
 * @property {string} portfolioId - Portfolio ID
 * @property {string} symbol - Stock symbol
 * @property {string} name - Stock name
 * @property {string} type - Transaction type ("buy", "sell", "dividend", "split")
 * @property {number} shares - Number of shares
 * @property {number} price - Price per share
 * @property {number} amount - Total amount
 * @property {number} fees - Transaction fees
 * @property {string} date - Transaction date (ISO date)
 * @property {string} notes - Optional notes
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} PortfolioPerformance
 * @property {string} portfolioId - Portfolio ID
 * @property {string} period - Period (e.g., "1D", "1W", "1M", "1Y", "ALL")
 * @property {PerformanceDataPoint[]} data - Performance data points
 * @property {number} startValue - Starting value
 * @property {number} endValue - Ending value
 * @property {number} totalReturn - Total return (absolute)
 * @property {number} totalReturnPercent - Total return (percentage)
 */

/**
 * @typedef {Object} PerformanceDataPoint
 * @property {string} date - ISO date string
 * @property {number} value - Portfolio value
 * @property {number} return - Return since start (absolute)
 * @property {number} returnPercent - Return since start (percentage)
 */

/**
 * @typedef {Object} PortfolioSummary
 * @property {Portfolio} portfolio - Portfolio details
 * @property {Holding[]} holdings - Current holdings
 * @property {number} holdingsCount - Number of holdings
 * @property {number} diversification - Diversification score (0-100)
 * @property {SectorAllocation[]} sectorAllocations - Allocation by sector
 * @property {AssetAllocation[]} assetAllocations - Allocation by asset type
 */

/**
 * @typedef {Object} SectorAllocation
 * @property {string} sector - Sector name
 * @property {number} value - Total value in sector
 * @property {number} allocation - Allocation percentage
 * @property {number} gainLoss - Gain/loss (absolute)
 * @property {number} gainLossPercent - Gain/loss (percentage)
 */

/**
 * @typedef {Object} AssetAllocation
 * @property {string} type - Asset type (e.g., "stocks", "cash", "bonds")
 * @property {number} value - Total value
 * @property {number} allocation - Allocation percentage
 */

/**
 * Example API Response Structures
 */

export const EXAMPLE_PORTFOLIO = {
  id: 'portfolio-1',
  name: 'Main Portfolio',
  description: 'My primary investment portfolio',
  totalValue: 125430.50,
  totalCost: 100000.00,
  totalGainLoss: 25430.50,
  totalGainLossPercent: 25.43,
  dayChange: 1234.50,
  dayChangePercent: 0.99,
  cashBalance: 5430.50,
  currency: 'USD',
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2024-03-15T20:00:00Z',
};

export const EXAMPLE_HOLDING = {
  id: 'holding-1',
  portfolioId: 'portfolio-1',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  shares: 100,
  avgCost: 150.00,
  totalCost: 15000.00,
  currentPrice: 178.45,
  currentValue: 17845.00,
  gainLoss: 2845.00,
  gainLossPercent: 18.97,
  dayChange: 234.00,
  dayChangePercent: 1.33,
  allocation: 14.22,
  lastUpdated: '2024-03-15T20:00:00Z',
};

export const EXAMPLE_TRANSACTION = {
  id: 'transaction-1',
  portfolioId: 'portfolio-1',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  type: 'buy',
  shares: 100,
  price: 150.00,
  amount: 15000.00,
  fees: 9.99,
  date: '2024-01-15',
  notes: 'Initial purchase',
  createdAt: '2024-01-15T10:30:00Z',
};

export const EXAMPLE_PERFORMANCE = {
  portfolioId: 'portfolio-1',
  period: '1M',
  data: [
    {
      date: '2024-02-15',
      value: 110000.00,
      return: 10000.00,
      returnPercent: 10.00,
    },
    {
      date: '2024-02-16',
      value: 111500.00,
      return: 11500.00,
      returnPercent: 11.50,
    },
    // ... more data points
  ],
  startValue: 100000.00,
  endValue: 125430.50,
  totalReturn: 25430.50,
  totalReturnPercent: 25.43,
};

export const EXAMPLE_PORTFOLIO_SUMMARY = {
  portfolio: EXAMPLE_PORTFOLIO,
  holdings: [EXAMPLE_HOLDING],
  holdingsCount: 8,
  diversification: 72,
  sectorAllocations: [
    {
      sector: 'Technology',
      value: 45000.00,
      allocation: 35.86,
      gainLoss: 8500.00,
      gainLossPercent: 23.33,
    },
    {
      sector: 'Healthcare',
      value: 28000.00,
      allocation: 22.32,
      gainLoss: 3200.00,
      gainLossPercent: 12.90,
    },
    // ... more sectors
  ],
  assetAllocations: [
    {
      type: 'stocks',
      value: 120000.00,
      allocation: 95.67,
    },
    {
      type: 'cash',
      value: 5430.50,
      allocation: 4.33,
    },
  ],
};

/**
 * Transaction Types
 */
export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
  DIVIDEND: 'dividend',
  SPLIT: 'split',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
};
