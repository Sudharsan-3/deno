'use client'

import api from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { FaArrowUp, FaArrowDown, FaBalanceScale, FaWallet } from 'react-icons/fa'

// Format number with commas & currency
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

  const cards = [
    {
      title: 'Income',
      value: summary.totalIncome,
      color: 'text-green-600',
      icon: <FaArrowUp className="text-green-500 text-3xl" />,
    },
    {
      title: 'Expense',
      value: summary.totalExpense,
      color: 'text-red-600',
      icon: <FaArrowDown className="text-red-500 text-3xl" />,
    },
    {
      title: 'Net Profit',
      value: summary.netProfit,
      color: summary.netProfit < 0 ? 'text-red-600' : 'text-green-600',
      icon: <FaBalanceScale className={`text-3xl ${summary.netProfit < 0 ? 'text-red-500' : 'text-green-500'}`} />,
    },
    {
      title: 'Total Balance',
      value: summary.totalBalance,
      color: 'text-blue-600',
      icon: <FaWallet className="text-blue-500 text-3xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-100 transition"
        >
          <div className="p-3 bg-gray-50 rounded-full shrink-0">
            {card.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-700 truncate">{card.title}</h2>
            <p className={`text-xl sm:text-2xl font-bold mt-2 ${card.color} break-words`}>
              {formatAmount(card.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
