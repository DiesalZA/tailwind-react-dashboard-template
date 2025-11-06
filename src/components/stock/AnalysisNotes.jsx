/**
 * AnalysisNotes Component
 *
 * Manual analysis workspace with structured sections for investment research
 */

import React, { useState, useEffect } from 'react';

const ANALYSIS_SECTIONS = [
  {
    id: 'thesis',
    title: 'Investment Thesis',
    icon: '💡',
    placeholder: 'What is the core investment thesis? Why is this an attractive opportunity?',
  },
  {
    id: 'bullCase',
    title: 'Bull Case',
    icon: '📈',
    placeholder: 'What could go right? Best case scenarios, growth drivers, competitive advantages...',
  },
  {
    id: 'bearCase',
    title: 'Bear Case',
    icon: '📉',
    placeholder: 'What could go wrong? Risks, challenges, competitive threats...',
  },
  {
    id: 'valuation',
    title: 'Valuation Analysis',
    icon: '💰',
    placeholder: 'Fair value estimate, valuation multiples, DCF analysis, comparison to peers...',
  },
  {
    id: 'management',
    title: 'Management & Governance',
    icon: '👔',
    placeholder: 'Leadership quality, track record, capital allocation, insider ownership...',
  },
  {
    id: 'risks',
    title: 'Key Risks & Concerns',
    icon: '⚠️',
    placeholder: 'Regulatory, competitive, operational, financial risks...',
  },
  {
    id: 'conclusion',
    title: 'Conclusion & Action',
    icon: '✓',
    placeholder: 'Final verdict, price target, buy/sell/hold recommendation, position sizing...',
  },
];

export default function AnalysisNotes({ symbol, onSave }) {
  const [notes, setNotes] = useState({});
  const [expandedSections, setExpandedSections] = useState(['thesis']); // Default to first section expanded
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved notes from localStorage
  useEffect(() => {
    if (symbol) {
      const savedNotes = localStorage.getItem(`analysis_${symbol}`);
      if (savedNotes) {
        try {
          const parsed = JSON.parse(savedNotes);
          setNotes(parsed.notes || {});
          setLastSaved(parsed.timestamp ? new Date(parsed.timestamp) : null);
        } catch (error) {
          console.error('Failed to parse saved notes:', error);
        }
      }
    }
  }, [symbol]);

  const handleNoteChange = (sectionId, value) => {
    setNotes((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const dataToSave = {
        symbol,
        notes,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(`analysis_${symbol}`, JSON.stringify(dataToSave));
      setLastSaved(new Date());

      if (onSave) {
        await onSave(dataToSave);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';

    const now = new Date();
    const diffMs = now - lastSaved;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getTotalWordCount = () => {
    return Object.values(notes).reduce((total, note) => {
      return total + (note || '').split(/\s+/).filter((word) => word.length > 0).length;
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Manual Analysis - {symbol}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getTotalWordCount()} words • Last saved: {formatLastSaved()}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-sm bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path d="M14 2H2c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1zM3 11V3h4v8H3zm8 0V3h2v8h-2z" />
                </svg>
                Save Notes
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Analysis sections */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700/60">
        {ANALYSIS_SECTIONS.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const noteContent = notes[section.id] || '';
          const wordCount = noteContent.split(/\s+/).filter((word) => word.length > 0).length;

          return (
            <div key={section.id} className="border-l-4 border-transparent hover:border-violet-500 transition-colors">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {section.title}
                    </h4>
                    {!isExpanded && noteContent && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {wordCount} word{wordCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Section content */}
              {isExpanded && (
                <div className="px-6 pb-4">
                  <textarea
                    value={noteContent}
                    onChange={(e) => handleNoteChange(section.id, e.target.value)}
                    placeholder={section.placeholder}
                    rows={6}
                    className="form-textarea w-full font-mono text-sm"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wordCount} word{wordCount !== 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={handleSave}
                      className="text-xs text-violet-500 hover:text-violet-600 font-medium"
                    >
                      Quick Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
