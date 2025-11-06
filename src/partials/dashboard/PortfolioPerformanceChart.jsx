/**
 * Portfolio Performance Chart
 *
 * Line chart showing portfolio value over time
 */

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

export default function PortfolioPerformanceChart() {
  const { currentPortfolio, holdings, loading } = usePortfolio();
  const [period, setPeriod] = useState('1M');

  // Mock historical data - in production this would come from API
  const generateMockData = (period) => {
    const dataPoints = {
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': 730,
    };

    const points = dataPoints[period] || 30;
    const today = new Date();
    const labels = [];
    const data = [];

    const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const baseValue = totalValue * 0.85; // Start at 85% of current value

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);

      // Generate random walk data that trends upward
      const progress = (points - i) / points;
      const trend = baseValue + (totalValue - baseValue) * progress;
      const noise = (Math.random() - 0.5) * totalValue * 0.02;
      data.push(Math.max(0, trend + noise));
    }

    return { labels, data };
  };

  const { labels, data } = generateMockData(period);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) },
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.4,
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

  if (!currentPortfolio) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 py-5">
          <header className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Portfolio Performance
            </h2>
          </header>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No portfolio selected
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Portfolio Performance
        </h2>
        {/* Period selector */}
        <div className="flex items-center gap-1">
          {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>
      <div className="p-5">
        {/* Chart */}
        <div className="flex flex-col">
          <div className="grow">
            <LineChart data={chartData} width={800} height={300} />
          </div>
        </div>
      </div>
    </div>
  );
}
