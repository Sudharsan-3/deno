"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";

const transactionHeading = [
  "S.No",
  "Transaction Date",
  "Value Date",
  "Description",
  "Amount",
  "Amount Type",
  "Balance",
  "Balance Type",
];

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions history found.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-md bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {transactionHeading.map((title, i) => (
                <th key={i} className="text-left px-4 py-2 border-b border-gray-200">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr
                key={txn.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border-b">{i + 1}</td>
                <td className="px-4 py-2 border-b">{formatDate(txn.transactionDate)}</td>
                <td className="px-4 py-2 border-b">{formatDate(txn.valueDate)}</td>
                <td className="px-4 py-2 border-b">{txn.description}</td>
                <td className="px-4 py-2 border-b">₹{txn.amount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{txn.amountType}</td>
                <td className="px-4 py-2 border-b">₹{txn.balance.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{txn.balanceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Optional: Format date string
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
