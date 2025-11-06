import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Screener from './pages/Screener';
import DevTools from './pages/DevTools';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/screener" element={<Screener />} />
        <Route path="/dev-tools" element={<DevTools />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
      </Routes>
    </>
  );
}

export default App;
