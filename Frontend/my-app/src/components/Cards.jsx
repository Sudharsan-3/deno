'use client'

import api from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { FaArrowUp, FaArrowDown, FaBalanceScale, FaWallet } from 'react-icons/fa'

// Format number with commas & currency
const formatAmount = (amount) => {
  return amount?.toLocaleString('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  });
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
      borderColor: 'border-l-green-500',
      icon: <FaArrowUp className="text-green-500 text-lg" />,
    },
    {
      title: 'Expense',
      value: summary.totalExpense,
      color: 'text-red-600',
      borderColor: 'border-l-red-500',
      icon: <FaArrowDown className="text-red-500 text-lg" />,
    },
    {
      title: 'Net Profit',
      value: summary.netProfit,
      color: summary.netProfit < 0 ? 'text-red-600' : 'text-green-600',
      borderColor: summary.netProfit < 0 ? 'border-l-red-500' : 'border-l-green-500',
      icon: <FaBalanceScale className={`text-lg ${summary.netProfit < 0 ? 'text-red-500' : 'text-green-500'}`} />,
    },
    {
      title: 'Total Balance',
      value: summary.totalBalance,
      color: 'text-blue-600',
      borderColor: 'border-l-blue-500',
      icon: <FaWallet className="text-blue-500 text-lg" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-t border-r border-b border-gray-100 hover:-translate-y-0.5"
          style={{ borderLeftColor: card.borderColor.replace('border-l-', '') }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</h2>
              <p className={`text-xl font-bold mt-1 ${card.color}`}>
                {formatAmount(card.value)}
              </p>
            </div>
            <div className="p-2 rounded-md bg-gray-100">
              {card.icon}
            </div>
          </div>
          
          {/* Subtle progress indicator */}
          <div className="mt-4">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-400" 
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;

// 'use client'

// import api from '@/lib/axios'
// import React, { useEffect, useState } from 'react'
// import { FaArrowUp, FaArrowDown, FaBalanceScale, FaWallet } from 'react-icons/fa'

// // Format number with commas & currency
// const formatAmount = (amount) => {
//   return amount?.toLocaleString('en-IN', { 
//     style: 'currency', 
//     currency: 'INR',
//     maximumFractionDigits: 0
//   });
// };

// const Cards = () => {
//   const [summary, setSummary] = useState({
//     totalIncome: 0,
//     totalExpense: 0,
//     netProfit: 0,
//     totalBalance: 0,
//   });

//   useEffect(() => {
//     const getSummary = async () => {
//       try {
//         const res = await api.get('/transaction/summary');
//         setSummary(res.data.data);
//       } catch (error) {
//         console.error("Error fetching summary:", error);
//       }
//     };

//     getSummary();
//   }, []);

//   const cards = [
//     {
//       title: 'Income',
//       value: summary.totalIncome,
//       color: 'text-white',
//       bgGradient: 'from-green-500 to-emerald-600',
//       icon: <FaArrowUp className="text-white text-xl" />,
//       trend: 'positive',
//     },
//     {
//       title: 'Expense',
//       value: summary.totalExpense,
//       color: 'text-white',
//       bgGradient: 'from-red-500 to-rose-600',
//       icon: <FaArrowDown className="text-white text-xl" />,
//       trend: 'negative',
//     },
//     {
//       title: 'Net Profit',
//       value: summary.netProfit,
//       color: summary.netProfit < 0 ? 'text-white' : 'text-white',
//       bgGradient: summary.netProfit < 0 ? 'from-rose-700 to-red-600' : 'from-teal-600 to-emerald-700',
//       icon: <FaBalanceScale className="text-white text-xl" />,
//       trend: summary.netProfit < 0 ? 'negative' : 'positive',
//     },
//     {
//       title: 'Total Balance',
//       value: summary.totalBalance,
//       color: 'text-white',
//       bgGradient: 'from-blue-600 to-indigo-700',
//       icon: <FaWallet className="text-white text-xl" />,
//       trend: 'neutral',
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
//       {cards.map((card, index) => (
//         <div
//           key={index}
//           className={`bg-gradient-to-r ${card.bgGradient} rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-sm font-medium text-white/90 uppercase tracking-wider">{card.title}</h2>
//               <p className={`text-2xl font-bold mt-2 ${card.color}`}>
//                 {formatAmount(card.value)}
//               </p>
//             </div>
//             <div className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm`}>
//               {card.icon}
//             </div>
//           </div>
          
//           {/* Progress indicator for visual interest */}
//           <div className="mt-4">
//             <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
//               <div 
//                 className={`h-full ${card.trend === 'positive' ? 'bg-white' : card.trend === 'negative' ? 'bg-rose-200' : 'bg-blue-200'}`} 
//                 style={{ width: card.trend === 'positive' ? '75%' : card.trend === 'negative' ? '60%' : '85%' }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Cards;