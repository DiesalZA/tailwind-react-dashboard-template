import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import { PortfolioProvider, WatchlistProvider } from './context';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <PortfolioProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </PortfolioProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
