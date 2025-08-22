"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

const transactionHeading = [
  "S.No",
  "Transaction Date",
  "Value Date",
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

    setRestoringId(id); // show loading state for this row
    try {
      await api.put("/transaction/restore", { id: [id] }); // send as array for consistency
      alert("Transaction restored successfully!");
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    } catch (error) {
      console.error("Error restoring transaction:", error);
      alert("Failed to restore transaction.");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Transaction History</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transaction history found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-sm">
                {transactionHeading.map((title, i) => (
                  <th key={i} className="px-4 py-3 font-semibold">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, i) => (
                <tr
                  key={txn.id}
                  className={`transition hover:bg-blue-50 text-gray-700 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{formatDate(txn.transactionDate)}</td>
                  <td className="px-4 py-3">{formatDate(txn.valueDate)}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]">{txn.description}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{txn.amountType}</td>
                  <td className="px-4 py-3 font-medium">₹{txn.balance.toLocaleString()}</td>
                  <td className="px-4 py-3">{txn.balanceType}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRestore(txn.id)}
                      disabled={restoringId === txn.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-white ${
                        restoringId === txn.id ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
