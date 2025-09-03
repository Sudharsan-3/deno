"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export const TransactionSnapshot = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [snap, setSnap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactionSnap = async () => {
      try {
        setLoading(true);
        const result = await api.post("/transaction/getTramsactionSnapshot", {
          id,
        });
        setSnap(result.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching transaction snapshot:", error);
        setError("Failed to load transaction snapshot.");
      } finally {
        setLoading(false);
      }
    };

    if (id) getTransactionSnap();
  }, [id]);

  const headers = [
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
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Pagination logic
  const totalPages = Math.ceil(snap.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = snap.slice(indexOfFirst, indexOfLast);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
      >
        ← Go Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Transaction Snapshot
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6 text-pink-600 text-lg font-medium">
          Loading transaction data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-6 text-red-600 text-lg font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-black text-white sticky top-0 z-10">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-sm font-semibold text-left border-b border-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((txn, index) => (
                    <tr
                      key={index}
                      className={`transition hover:bg-pink-50 ${
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
                      <td className="px-6 py-3 font-semibold text-pink-600">
                        {txn.amount ? formatCurrency(txn.amount) : "-"}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {txn.amountType || "-"}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {txn.balance ? formatCurrency(txn.balance) : "-"}
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
                      colSpan={headers.length}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No transaction data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {snap.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 transition"
              >
                Previous
              </button>

              <p className="text-gray-700 font-semibold">
                Page{" "}
                <span className="text-pink-600">{currentPage}</span> of{" "}
                <span className="text-black">{totalPages}</span>
              </p>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


