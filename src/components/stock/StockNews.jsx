/**
 * Stock News Component
 *
 * Displays news articles related to a stock
 */

import React from 'react';

export default function StockNews({ news = [], loading = false, className = '' }) {
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          News & Updates
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          News & Updates
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No news available
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return null;

    const colors = {
      positive: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      negative: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[sentiment.toLowerCase()] || colors.neutral}`}>
        {sentiment}
      </span>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        News & Updates
      </h3>
      <div className="space-y-4">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-3 -m-3 transition-colors"
          >
            <div className="flex gap-4">
              {/* Image */}
              {article.image && (
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-violet-500 dark:group-hover:text-violet-400 mb-1 line-clamp-2">
                  {article.title}
                </h4>

                {/* Summary */}
                {article.summary && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {article.summary}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {article.source && (
                    <span className="font-medium">{article.source}</span>
                  )}
                  {article.publishedAt && (
                    <>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </>
                  )}
                  {article.sentiment && (
                    <>
                      <span>•</span>
                      {getSentimentBadge(article.sentiment)}
                    </>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
