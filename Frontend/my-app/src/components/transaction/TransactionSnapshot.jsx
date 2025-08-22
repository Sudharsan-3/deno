"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

export const TransactionSnapshot = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [snap, setSnap] = useState([]);

  useEffect(() => {
    const getTransactionSnap = async () => {
      try {
        const result = await api.post("/transaction/getTramsactionSnapshot", {
          id,
        });
        setSnap(result.data?.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getTransactionSnap();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Transaction Snapshot
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              {[
                "Transaction Date",
                "Value Date",
                "Description",
                "Cheque / Ref",
                "Amount",
                "Amount Type",
                "Balance",
                "Balance Type",
                "Change Reason",
                "Invoice",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-sm font-semibold text-gray-600 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {snap.length > 0 ? (
              snap.map((txn, index) => (
                <tr
                  key={index}
                  className={`transition hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 text-gray-700">
                    {txn.transactionDate || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.valueDate || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700 truncate max-w-[200px]">
                    {txn.description || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.chequeOrRef || "-"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-blue-600">
                    {txn.amount ? `₹${txn.amount}` : "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.amountType || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.balance ? `₹${txn.balance}` : "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.balanceType || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.changeReason || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {txn.invoice || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No transaction data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
