"use client";

import api from "../lib/axios";
import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

const transactionHeading = [
  "S.No",
  "Transaction Date",
  "ChequeOrRef",
  "Description",
  "Amount",
  "Amount Type",
  "Balance",
  "Balance Type",
  "Action",
];

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const resp = await api.get("/transaction/history");
        setTransactions(resp.data.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleRestore = async (id) => {
    if (!id) return;

    setRestoringId(id);
    try {
      await api.put("/transaction/restore", { id: [id] });
      alert("Transaction restored successfully!");
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    } catch (error) {
      console.error("Error restoring transaction:", error);
      alert("Failed to restore transaction.");
    } finally {
      setRestoringId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          Transaction History
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 text-center">No transaction history found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-sm tracking-wide">
                  {transactionHeading.map((title, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 font-semibold whitespace-nowrap"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((txn, i) => (
                  <tr
                    key={txn.id}
                    className={`transition hover:bg-pink-50 text-gray-700 text-sm sm:text-base ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{indexOfFirst + i + 1}</td>
                    <td className="px-4 py-3">
                      {formatDate(txn.transactionDate)}
                    </td>
                    <td className="px-4 py-3">{txn.chequeOrRef}</td>
                    <td className="px-4 py-3 truncate max-w-[150px] sm:max-w-[250px]">
                      {txn.description}
                    </td>
                    <td className="px-4 py-3 font-semibold text-pink-600">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{txn.amountType}</td>
                    <td className="px-4 py-3 font-medium">
                      ₹{txn.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{txn.balanceType}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRestore(txn.id)}
                        disabled={restoringId === txn.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition whitespace-nowrap ${
                          restoringId === txn.id
                            ? "bg-gray-400"
                            : "bg-pink-600 hover:bg-pink-700"
                        }`}
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        {restoringId === txn.id ? "Restoring..." : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Date Formatter
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default History;


// "use client";

// // import api from "@/lib/axios";
// import api from "../lib/axios"
// import React, { useEffect, useState } from "react";
// import { FiRefreshCw } from "react-icons/fi";

// const transactionHeading = [
//   "S.No",
//   "Transaction Date",
//   "chequeOrRef",
//   "Description",
//   "Amount",
//   "Amount Type",
//   "Balance",
//   "Balance Type",
//   "Action",
// ];

// const History = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [restoringId, setRestoringId] = useState(null);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const resp = await api.get("/transaction/history");
//         setTransactions(resp.data.data || []);
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTransactions();
//   }, []);
//   console.log(transactions,"from history")
//   const handleRestore = async (id) => {
//     if (!id) return;

//     setRestoringId(id); // show loading state for this row
//     try {
//       await api.put("/transaction/restore", { id: [id] }); // send as array for consistency
//       alert("Transaction restored successfully!");
//       setTransactions((prev) => prev.filter((txn) => txn.id !== id));
//     } catch (error) {
//       console.error("Error restoring transaction:", error);
//       alert("Failed to restore transaction.");
//     } finally {
//       setRestoringId(null);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
//         <h2 className="text-2xl sm:text-3xl font-bold text-black">
//           Transaction History
//         </h2>
//       </div>

//       {loading ? (
//         <p className="text-gray-500 text-center">Loading...</p>
//       ) : transactions.length === 0 ? (
//         <p className="text-gray-500 text-center">No transaction history found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-pink-200">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-pink-100 text-black uppercase text-sm tracking-wide">
//                 {transactionHeading.map((title, i) => (
//                   <th key={i} className="px-4 py-3 font-semibold whitespace-nowrap">
//                     {title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((txn, i) => (
//                 <tr
//                   key={txn.id}
//                   className={`transition hover:bg-pink-50 text-gray-700 text-sm sm:text-base ${
//                     i % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   }`}
//                 >
//                   <td className="px-4 py-3">{i + 1}</td>
//                   <td className="px-4 py-3">{formatDate(txn.transactionDate)}</td>
//                   <td className="px-4 py-3">{(txn.chequeOrRef)}</td>
//                   <td className="px-4 py-3 truncate max-w-[150px] sm:max-w-[250px]">{txn.description}</td>
//                   <td className="px-4 py-3 font-semibold text-pink-600">
//                     ₹{txn.amount.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3">{txn.amountType}</td>
//                   <td className="px-4 py-3 font-medium">₹{txn.balance.toLocaleString()}</td>
//                   <td className="px-4 py-3">{txn.balanceType}</td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => handleRestore(txn.id)}
//                       disabled={restoringId === txn.id}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition whitespace-nowrap ${
//                         restoringId === txn.id
//                           ? "bg-gray-400"
//                           : "bg-pink-600 hover:bg-pink-700"
//                       }`}
//                     >
//                       <FiRefreshCw className="w-4 h-4" />
//                       {restoringId === txn.id ? "Restoring..." : "Restore"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// // Date Formatter
// const formatDate = (dateStr) => {
//   if (!dateStr) return "-";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// export default History;
