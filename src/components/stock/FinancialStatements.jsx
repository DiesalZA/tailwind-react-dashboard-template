/**
 * FinancialStatements Component
 *
 * Displays multi-year financial statements (Income, Balance Sheet, Cash Flow)
 */

import React, { useState } from 'react';
import { formatValue } from '../../utils/Utils';

export default function FinancialStatements({ symbol, financialData }) {
  const [activeStatement, setActiveStatement] = useState('income'); // income, balance, cashflow

  if (!financialData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No financial data available
        </p>
      </div>
    );
  }

  const statements = {
    income: {
      title: 'Income Statement',
      sections: [
        {
          name: 'Revenue',
          items: [
            { label: 'Total Revenue', key: 'revenue' },
            { label: 'Cost of Revenue', key: 'costOfRevenue', negative: true },
            { label: 'Gross Profit', key: 'grossProfit', bold: true },
          ],
        },
        {
          name: 'Operating Expenses',
          items: [
            { label: 'R&D', key: 'researchAndDevelopment', negative: true },
            { label: 'SG&A', key: 'sellingGeneralAdmin', negative: true },
            { label: 'Operating Expenses', key: 'operatingExpenses', negative: true, bold: true },
          ],
        },
        {
          name: 'Profitability',
          items: [
            { label: 'Operating Income', key: 'operatingIncome', bold: true },
            { label: 'Interest Expense', key: 'interestExpense', negative: true },
            { label: 'Income Before Tax', key: 'incomeBeforeTax' },
            { label: 'Income Tax', key: 'incomeTax', negative: true },
            { label: 'Net Income', key: 'netIncome', bold: true, highlight: true },
          ],
        },
        {
          name: 'Per Share',
          items: [
            { label: 'EPS (Basic)', key: 'epsBasic', isRatio: true },
            { label: 'EPS (Diluted)', key: 'epsDiluted', isRatio: true },
          ],
        },
      ],
    },
    balance: {
      title: 'Balance Sheet',
      sections: [
        {
          name: 'Assets',
          items: [
            { label: 'Cash & Equivalents', key: 'cash' },
            { label: 'Short-term Investments', key: 'shortTermInvestments' },
            { label: 'Accounts Receivable', key: 'accountsReceivable' },
            { label: 'Inventory', key: 'inventory' },
            { label: 'Total Current Assets', key: 'currentAssets', bold: true },
            { label: 'Property & Equipment', key: 'propertyEquipment' },
            { label: 'Goodwill', key: 'goodwill' },
            { label: 'Intangible Assets', key: 'intangibleAssets' },
            { label: 'Total Assets', key: 'totalAssets', bold: true, highlight: true },
          ],
        },
        {
          name: 'Liabilities',
          items: [
            { label: 'Accounts Payable', key: 'accountsPayable' },
            { label: 'Short-term Debt', key: 'shortTermDebt' },
            { label: 'Total Current Liabilities', key: 'currentLiabilities', bold: true },
            { label: 'Long-term Debt', key: 'longTermDebt' },
            { label: 'Total Liabilities', key: 'totalLiabilities', bold: true, highlight: true },
          ],
        },
        {
          name: 'Equity',
          items: [
            { label: 'Common Stock', key: 'commonStock' },
            { label: 'Retained Earnings', key: 'retainedEarnings' },
            { label: 'Total Equity', key: 'totalEquity', bold: true, highlight: true },
          ],
        },
      ],
    },
    cashflow: {
      title: 'Cash Flow Statement',
      sections: [
        {
          name: 'Operating Activities',
          items: [
            { label: 'Net Income', key: 'netIncome' },
            { label: 'Depreciation & Amortization', key: 'depreciation' },
            { label: 'Stock-based Compensation', key: 'stockCompensation' },
            { label: 'Change in Working Capital', key: 'workingCapitalChange' },
            { label: 'Operating Cash Flow', key: 'operatingCashFlow', bold: true, highlight: true },
          ],
        },
        {
          name: 'Investing Activities',
          items: [
            { label: 'Capital Expenditures', key: 'capitalExpenditures', negative: true },
            { label: 'Acquisitions', key: 'acquisitions', negative: true },
            { label: 'Investment Purchases', key: 'investmentPurchases', negative: true },
            { label: 'Investing Cash Flow', key: 'investingCashFlow', bold: true, negative: true },
          ],
        },
        {
          name: 'Financing Activities',
          items: [
            { label: 'Dividends Paid', key: 'dividendsPaid', negative: true },
            { label: 'Share Repurchases', key: 'shareRepurchases', negative: true },
            { label: 'Debt Issued', key: 'debtIssued' },
            { label: 'Financing Cash Flow', key: 'financingCashFlow', bold: true },
          ],
        },
        {
          name: 'Summary',
          items: [
            { label: 'Net Change in Cash', key: 'netCashChange', bold: true, highlight: true },
            { label: 'Free Cash Flow', key: 'freeCashFlow', bold: true, highlight: true },
          ],
        },
      ],
    },
  };

  const currentStatement = statements[activeStatement];
  const years = financialData.years || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      {/* Statement tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex gap-1 px-6 pt-4">
          {Object.entries(statements).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setActiveStatement(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeStatement === key
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Statement content */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700/60">
              <th className="text-left py-3 pr-4 font-semibold text-gray-800 dark:text-gray-100">
                {currentStatement.title}
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  className="text-right py-3 px-4 font-semibold text-gray-800 dark:text-gray-100 min-w-32"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStatement.sections.map((section, sectionIdx) => (
              <React.Fragment key={sectionIdx}>
                {/* Section header */}
                <tr>
                  <td
                    colSpan={years.length + 1}
                    className="pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {section.name}
                  </td>
                </tr>
                {/* Section items */}
                {section.items.map((item, itemIdx) => (
                  <tr
                    key={itemIdx}
                    className={`${
                      item.highlight
                        ? 'bg-violet-50 dark:bg-violet-900/10 border-t border-b border-violet-200 dark:border-violet-800/30'
                        : ''
                    }`}
                  >
                    <td
                      className={`py-2 pr-4 ${
                        item.bold
                          ? 'font-semibold text-gray-800 dark:text-gray-100'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.label}
                    </td>
                    {years.map((year) => {
                      const value = financialData[activeStatement]?.[year]?.[item.key];
                      const displayValue = value !== undefined && value !== null
                        ? item.isRatio
                          ? `$${value.toFixed(2)}`
                          : formatValue(value)
                        : '—';

                      return (
                        <td
                          key={year}
                          className={`text-right py-2 px-4 ${
                            item.bold
                              ? 'font-semibold text-gray-800 dark:text-gray-100'
                              : 'text-gray-600 dark:text-gray-400'
                          } ${
                            item.negative && value > 0 ? 'text-red-600 dark:text-red-400' : ''
                          }`}
                        >
                          {item.negative && value > 0 && !item.isRatio ? `(${displayValue})` : displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
