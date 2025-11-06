import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import PortfolioValueCard from '../partials/dashboard/PortfolioValueCard';
import TodayGainLossCard from '../partials/dashboard/TodayGainLossCard';
import TotalReturnCard from '../partials/dashboard/TotalReturnCard';
import PortfolioPerformanceChart from '../partials/dashboard/PortfolioPerformanceChart';
import TopHoldingsTable from '../partials/dashboard/TopHoldingsTable';
import WatchlistMovers from '../partials/dashboard/WatchlistMovers';
import MarketSummary from '../partials/dashboard/MarketSummary';
import RecentActivity from '../partials/dashboard/RecentActivity';
import SectorAllocation from '../partials/dashboard/SectorAllocation';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your portfolio overview and market insights
                </p>
              </div>

              {/* Right: Quick Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <Link
                  to="/portfolio"
                  className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                >
                  <svg className="fill-current mr-2" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                  </svg>
                  <span>View Portfolio</span>
                </Link>
                <Link
                  to="/screener"
                  className="btn bg-violet-500 hover:bg-violet-600 text-white"
                >
                  <svg className="fill-current mr-2" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                  </svg>
                  <span>Stock Screener</span>
                </Link>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-12 gap-6">

              {/* Row 1: Portfolio Summary Stats */}
              <PortfolioValueCard />
              <TodayGainLossCard />
              <TotalReturnCard />

              {/* Row 2: Portfolio Performance Chart */}
              <PortfolioPerformanceChart />

              {/* Row 3: Top Holdings & Watchlist Movers */}
              <TopHoldingsTable />
              <WatchlistMovers />

              {/* Row 4: Market Summary & Recent Activity */}
              <MarketSummary />
              <RecentActivity />

              {/* Row 5: Sector Allocation */}
              <SectorAllocation />

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;