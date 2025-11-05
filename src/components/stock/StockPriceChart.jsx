/**
 * Stock Price Chart Component
 *
 * Displays historical stock price data with timeframe selection
 */

import React, { useState, useEffect } from 'react';
import LineChart02 from '../../charts/LineChart02';
import { stockService } from '../../services';
import { TIMEFRAMES } from '../../utils/constants';

export default function StockPriceChart({ symbol, className = '' }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

  useEffect(() => {
    fetchChartData();
  }, [symbol, selectedTimeframe]);

  const fetchChartData = async () => {
    setLoading(true);

    const timeframeConfig = TIMEFRAMES[selectedTimeframe];
    const response = await stockService.getHistoricalData(symbol, {
      interval: timeframeConfig.interval,
      period: selectedTimeframe,
    });

    if (response.success) {
      const data = response.data.data || response.data || [];

      // Format data for Chart.js
      const labels = data.map(item => {
        const date = new Date(item.date);
        if (selectedTimeframe === '1D') {
          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (['1W', '1M'].includes(selectedTimeframe)) {
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
      });

      const prices = data.map(item => item.close);

      setChartData({
        labels,
        datasets: [
          {
            label: symbol,
            data: prices,
            borderColor: '#8470FF',
            backgroundColor: 'rgba(132, 112, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: '#8470FF',
            pointHoverBackgroundColor: '#8470FF',
            pointBorderColor: '#ffffff',
            pointHoverBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      });
    }

    setLoading(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 ${className}`}>
      {/* Header with Timeframe Selector */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Price Chart
          </h3>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTimeframe === timeframe
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {TIMEFRAMES[timeframe]?.label || timeframe}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <svg
                className="animate-spin w-8 h-8 fill-current text-gray-400 mx-auto mb-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading chart...
              </div>
            </div>
          </div>
        ) : chartData ? (
          <LineChart02
            data={chartData}
            width={800}
            height={400}
          />
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-gray-500 dark:text-gray-400">
              No chart data available
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
