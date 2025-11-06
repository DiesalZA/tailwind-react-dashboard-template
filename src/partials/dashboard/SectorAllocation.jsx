/**
 * Sector Allocation
 *
 * Doughnut chart showing portfolio distribution by sector
 */

import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import DoughnutChart from '../../charts/DoughnutChart';
import { formatValue } from '../../utils/Utils';
import { getCssVariable } from '../../utils/Utils';

export default function SectorAllocation() {
  const { currentPortfolio, holdings, loading } = usePortfolio();

  // Calculate sector allocations
  // In production, sector data would come from API
  // For now, we'll use mock sector assignments
  const sectorMap = {
    AAPL: 'Technology',
    MSFT: 'Technology',
    GOOGL: 'Technology',
    TSLA: 'Automotive',
    NVDA: 'Technology',
    AMZN: 'Consumer',
  };

  const sectorColors = {
    Technology: getCssVariable('--color-violet-500'),
    Financial: getCssVariable('--color-blue-500'),
    Healthcare: getCssVariable('--color-green-500'),
    Consumer: getCssVariable('--color-yellow-500'),
    Energy: getCssVariable('--color-red-500'),
    Automotive: getCssVariable('--color-orange-500'),
    Industrial: getCssVariable('--color-gray-500'),
    Other: getCssVariable('--color-gray-400'),
  };

  const sectorTotals = {};
  let totalValue = 0;

  holdings.forEach((holding) => {
    const sector = sectorMap[holding.symbol] || 'Other';
    if (!sectorTotals[sector]) {
      sectorTotals[sector] = 0;
    }
    sectorTotals[sector] += holding.currentValue;
    totalValue += holding.currentValue;
  });

  // Convert to array and sort by value
  const sectorData = Object.entries(sectorTotals)
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: sectorColors[sector] || sectorColors.Other,
    }))
    .sort((a, b) => b.value - a.value);

  const chartData = {
    labels: sectorData.map((s) => s.sector),
    datasets: [
      {
        label: 'Portfolio Allocation',
        data: sectorData.map((s) => s.value),
        backgroundColor: sectorData.map((s) => s.color),
        hoverBackgroundColor: sectorData.map((s) => s.color),
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPortfolio || holdings.length === 0) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sector Allocation</h2>
        </header>
        <div className="p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            No holdings to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sector Allocation</h2>
      </header>
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Chart */}
          <div className="flex-shrink-0 lg:w-64">
            <DoughnutChart data={chartData} width={256} height={256} />
          </div>

          {/* Legend */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectorData.map((sector) => (
                <div key={sector.sector} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sector.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {sector.sector}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 ml-2">
                        {sector.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${sector.percentage}%`,
                            backgroundColor: sector.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-20 text-right">
                        {formatValue(sector.value)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
