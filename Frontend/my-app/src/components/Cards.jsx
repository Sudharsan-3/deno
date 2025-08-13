'use client'

import api from '@/lib/axios'
import React, { useEffect, useState } from 'react'

// Optional: Format number with commas
const formatAmount = (amount) => {
  return amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

const Cards = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    const getSummary = async () => {
      try {
        const res = await api.get('/transaction/summary');
        setSummary(res.data.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    getSummary();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {/* Income */}
      <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500 hover:bg-gray-100 transition">
        <h2 className="text-lg font-semibold text-gray-700">Income</h2>
        <p className="text-2xl font-bold text-green-600 mt-2">
          {formatAmount(summary.totalIncome)}
        </p>
      </div>

      {/* Expense */}
      <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-500 hover:bg-gray-100 transition">
        <h2 className="text-lg font-semibold text-gray-700">Expense</h2>
        <p className="text-2xl font-bold text-red-600 mt-2">
          {formatAmount(summary.totalExpense)}
        </p>
      </div>

      {/* Net Profit */}
      <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500 hover:bg-gray-100 transition">
        <h2 className="text-lg font-semibold text-gray-700">Net Profit</h2>
        <p className={`text-2xl font-bold mt-2 ${summary.netProfit < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatAmount(summary.netProfit)}
        </p>
      </div>

      {/* Total Balance */}
      <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500 hover:bg-gray-100 transition">
        <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {formatAmount(summary.totalBalance)}
        </p>
      </div>
    </div>
  );
};

export default Cards;
