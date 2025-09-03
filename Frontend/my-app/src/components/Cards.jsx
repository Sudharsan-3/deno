'use client'

// import api from '@/lib/axios'
import api from "../lib/axios"
import React, { useEffect, useState } from 'react'
import { FaArrowUp, FaArrowDown, FaBalanceScale, FaWallet } from 'react-icons/fa'
 import { useAuth } from "@/context/AuthContext";
// Format number with commas & currency
const formatAmount = (amount) => {
  return amount?.toLocaleString('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  });
};

const Cards = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);


 
const { user, logout } = useAuth();
const [showWelcome, setShowWelcome] = useState(false);
 


  useEffect(() => {
    const getSummary = async () => {
      try {
        const res = await api.get('/transaction/summary');
        setSummary(res.data.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    getSummary();
  }, []);

  // If still loading
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading summary...</div>;
  }

  // If no summary or all values are zero
  if (
    !summary ||
    (summary.totalIncome === 0 &&
     summary.totalExpense === 0 &&
     summary.netProfit === 0 &&
     summary.totalBalance === 0)
  ) {
    return (
      <div className="text-center py-10 text-gray-500 font-semibold text-lg">
        No transactions to show
      </div>
    );
  }

  const cards = [
    {
      title: 'Income',
      value: summary.totalIncome,
      color: 'text-green-700',
      bg: 'bg-gradient-to-br from-green-100 to-green-50',
      hoverBg: 'hover:from-green-200 hover:to-green-100',
      icon: <FaArrowUp className="text-green-600 text-xl" />,
      barColor: 'bg-green-500'
    },
    {
      title: 'Expense',
      value: summary.totalExpense,
      color: 'text-red-700',
      bg: 'bg-gradient-to-br from-red-100 to-red-50',
      hoverBg: 'hover:from-red-200 hover:to-red-100',
      icon: <FaArrowDown className="text-red-600 text-xl" />,
      barColor: 'bg-red-500'
    },
    {
      title: 'Net Profit',
      value: summary.netProfit,
      color: summary.netProfit < 0 ? 'text-red-700' : 'text-pink-700',
      bg: summary.netProfit < 0 
        ? 'bg-gradient-to-br from-red-100 to-red-50' 
        : 'bg-gradient-to-br from-pink-100 to-pink-50',
      hoverBg: summary.netProfit < 0
        ? 'hover:from-red-200 hover:to-red-100'
        : 'hover:from-pink-200 hover:to-pink-100',
      icon: <FaBalanceScale className={`text-xl ${summary.netProfit < 0 ? 'text-red-600' : 'text-pink-600'}`} />,
      barColor: summary.netProfit < 0 ? 'bg-red-500' : 'bg-pink-500'
    },
    {
      title: 'Total Balance',
      value: summary.totalBalance,
      color: 'text-gray-900',
      bg: 'bg-gradient-to-br from-gray-100 to-white',
      hoverBg: 'hover:from-gray-200 hover:to-gray-50',
      icon: <FaWallet className="text-gray-700 text-xl" />,
      barColor: 'bg-gray-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4">
      {showWelcome && (
        <div className="bg-green-50 border border-green-300 text-green-700 text-center py-4 px-6 font-semibold text-lg shadow-md">
          🎉 Welcome back, {user.name}! Glad to see you again.
        </div>
      )}
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            ${card.bg} ${card.hoverBg}
            rounded-xl p-6 shadow-md hover:shadow-xl
            transition-all duration-300 transform hover:-translate-y-1
            border border-gray-100
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.title}</h2>
              <p className={`text-2xl font-extrabold mt-2 ${card.color}`}>
                {formatAmount(card.value)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-inner">
              {card.icon}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-5">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${card.barColor} transition-all duration-500`} 
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
//       color: 'text-green-600',
//       borderColor: 'border-l-green-500',
//       icon: <FaArrowUp className="text-green-500 text-lg" />,
//     },
//     {
//       title: 'Expense',
//       value: summary.totalExpense,
//       color: 'text-red-600',
//       borderColor: 'border-l-red-500',
//       icon: <FaArrowDown className="text-red-500 text-lg" />,
//     },
//     {
//       title: 'Net Profit',
//       value: summary.netProfit,
//       color: summary.netProfit < 0 ? 'text-red-600' : 'text-green-600',
//       borderColor: summary.netProfit < 0 ? 'border-l-red-500' : 'border-l-green-500',
//       icon: <FaBalanceScale className={`text-lg ${summary.netProfit < 0 ? 'text-red-500' : 'text-green-500'}`} />,
//     },
//     {
//       title: 'Total Balance',
//       value: summary.totalBalance,
//       color: 'text-blue-600',
//       borderColor: 'border-l-blue-500',
//       icon: <FaWallet className="text-blue-500 text-lg" />,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
//       {cards.map((card, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-t border-r border-b border-gray-100 hover:-translate-y-0.5"
//           style={{ borderLeftColor: card.borderColor.replace('border-l-', '') }}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</h2>
//               <p className={`text-xl font-bold mt-1 ${card.color}`}>
//                 {formatAmount(card.value)}
//               </p>
//             </div>
//             <div className="p-2 rounded-md bg-gray-100">
//               {card.icon}
//             </div>
//           </div>
          
//           {/* Subtle progress indicator */}
//           <div className="mt-4">
//             <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-gray-400" 
//                 style={{ width: '65%' }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Cards;

