# API Services Documentation

This directory contains all API service modules for the stock research platform. These are client-side wrappers around your Django/FastAPI backend endpoints.

## Architecture

```
services/
├── api.js                  # Base HTTP client with auth & error handling
├── authService.js          # Authentication endpoints
├── stockService.js         # Stock data endpoints
├── portfolioService.js     # Portfolio management endpoints
├── watchlistService.js     # Watchlist endpoints
├── marketService.js        # Market data endpoints
└── index.js                # Centralized exports
```

## Configuration

Update the API base URL in `src/utils/constants.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8000/api'; // Update for production
```

Or set via environment variable:
```bash
VITE_API_BASE_URL=https://api.yourapp.com
```

## Usage

### Import Services

```javascript
// Import specific service
import { stockService } from '../services';

// Or import individual service
import stockService from '../services/stockService';
```

### Making API Calls

All service methods return a Promise with this structure:

```javascript
{
  success: boolean,
  data?: any,           // Response data (if successful)
  error?: {             // Error object (if failed)
    message: string,
    code: string,
    status?: number,
    details?: any
  }
}
```

### Example Usage

```javascript
// Get stock quote
const response = await stockService.getQuote('AAPL');

if (response.success) {
  console.log('Stock price:', response.data.price);
} else {
  console.error('Error:', response.error.message);
}

// Search stocks
const searchResults = await stockService.search('apple');

// Get portfolio holdings
const holdings = await portfolioService.getHoldings('portfolio-123');
```

## Backend API Contract

### Response Format

Your Django/FastAPI backend should return responses in this format:

**Success Response:**
```json
{
  "data": { ... },      // Or "results", "items", etc.
  "message": "Success"  // Optional
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }    // Optional
}
```

### Authentication

The API client automatically includes the JWT token in requests:

```
Authorization: Bearer <token>
```

Store the token in localStorage after login:
```javascript
const response = await authService.login({ email, password });
// Token is automatically stored
```

### Endpoint Mapping

The service layer expects these endpoints:

#### Stock Service
- `GET /api/stocks/search?q={query}&limit={limit}`
- `GET /api/stocks/quote/{symbol}`
- `GET /api/stocks/quote?symbols={AAPL,MSFT,...}`
- `GET /api/stocks/historical/{symbol}?interval={interval}&period={period}`
- `GET /api/stocks/fundamentals/{symbol}`
- `GET /api/stocks/news/{symbol}?limit={limit}`
- `GET /api/stocks/popular?limit={limit}`

#### Portfolio Service
- `GET /api/portfolio` - List all portfolios
- `POST /api/portfolio` - Create portfolio
- `GET /api/portfolio/{id}` - Get portfolio
- `PATCH /api/portfolio/{id}` - Update portfolio
- `DELETE /api/portfolio/{id}` - Delete portfolio
- `GET /api/portfolio/{id}/holdings` - Get holdings
- `GET /api/portfolio/{id}/transactions` - Get transactions
- `POST /api/portfolio/{id}/transactions` - Add transaction
- `GET /api/portfolio/{id}/performance?period={period}` - Get performance
- `GET /api/portfolio/summary?id={id}` - Get summary

#### Watchlist Service
- `GET /api/watchlist` - List all watchlists
- `POST /api/watchlist` - Create watchlist
- `GET /api/watchlist/{id}` - Get watchlist
- `PATCH /api/watchlist/{id}` - Update watchlist
- `DELETE /api/watchlist/{id}` - Delete watchlist
- `GET /api/watchlist/{id}/items` - Get items
- `POST /api/watchlist/{id}/items` - Add stock
- `DELETE /api/watchlist/{id}/items/{itemId}` - Remove stock

#### Market Service
- `GET /api/market/indices` - Get major indices
- `GET /api/market/sectors` - Get sector performance
- `GET /api/market/movers?limit={limit}` - Get gainers/losers/active
- `GET /api/market/news?limit={limit}` - Get market news
- `GET /api/market/status` - Get market status

#### Auth Service
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get profile
- `PATCH /api/auth/profile` - Update profile

## Error Handling

The base API client handles common errors:

- **Network errors**: Connection failures
- **401 Unauthorized**: Clears auth token, redirects to login
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **422 Validation Error**: Invalid request data
- **500 Server Error**: Backend error
- **Timeout**: Request timeout (30s default)

### Custom Error Handling

```javascript
const response = await stockService.getQuote('INVALID');

if (!response.success) {
  switch (response.error.code) {
    case 'HTTP_404':
      console.log('Stock not found');
      break;
    case 'NETWORK_ERROR':
      console.log('Connection failed');
      break;
    case 'TIMEOUT_ERROR':
      console.log('Request timed out');
      break;
    default:
      console.log('Unknown error:', response.error.message);
  }
}
```

## Data Types

Type definitions are available in `src/types/`:
- `stock.js` - Stock, Quote, HistoricalData, Fundamentals
- `portfolio.js` - Portfolio, Holding, Transaction, Performance
- `watchlist.js` - Watchlist, WatchlistItem
- `market.js` - MarketIndex, Sector, Mover, MarketNews

These include JSDoc comments for IDE autocomplete and example response structures.

## Testing with Mock Data

To test the frontend before the backend is ready:

1. **Create a mock service:**
```javascript
// src/services/mockStockService.js
import { EXAMPLE_QUOTE } from '../types/stock';

const mockStockService = {
  async getQuote(symbol) {
    return {
      success: true,
      data: { ...EXAMPLE_QUOTE, symbol },
    };
  },
  // ... other methods
};

export default mockStockService;
```

2. **Swap services in development:**
```javascript
// Use mock or real service based on env
const stockService = import.meta.env.DEV
  ? mockStockService
  : realStockService;
```

## Environment Variables

Create `.env` file in project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_WEBSOCKET=true
```

## WebSocket Support (Future)

For real-time price updates, implement a WebSocket service:

```javascript
// src/services/websocketService.js
import { WS_BASE_URL } from '../utils/constants';

class WebSocketService {
  connect() { ... }
  subscribe(symbols) { ... }
  unsubscribe(symbols) { ... }
  onPriceUpdate(callback) { ... }
}
```

## Next Steps

1. **Update API endpoints** in `src/utils/constants.js` to match your backend
2. **Test each service** with your Django/FastAPI backend
3. **Adjust response parsing** if your backend returns different data structures
4. **Add error handling** specific to your business logic
5. **Implement caching** strategy (React Query, SWR, or custom)
6. **Add request interceptors** for logging, analytics, etc.
