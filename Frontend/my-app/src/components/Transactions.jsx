"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import { RiAddCircleLine } from "react-icons/ri";

import Filter from "./transaction/Filter";
import ShowUpload from "./transaction/ShowUpload";
import PreviewImage from "./transaction/PreviewImage";
import ShowAttachemnts from "./transaction/ShowAttachemnts";
import Image from "next/image";
import viewLogo from "@/app/public/show-svgrepo-com.svg"
import hideLog from "@/app/public/hide-svgrepo-com.svg"
import Upload from "./transaction/Upload";
import Link from "next/link";


const transactionHeading = [
  "",
  
  "Transaction Date",
  "ChequeOrRef",
  "Value Date",
  "Description",
  "Amount",
  "Amount Type",
  "Balance",
  "Balance Type",
  "Invoice",
  "Attachments",
  "Actions",
];

const Transactions = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showAttachments, setShowAttachments] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTxnId, setUploadTxnId] = useState(null);



  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/transaction/all");
      console.log(resp.data, "from ui frontend get all transaction");
      setTransactions(resp.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (txn) => {
    setSelectedTxn(txn);
    setIsPopupOpen(true);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (typeof window === "undefined") return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected transactions?"
    );
    if (!confirmDelete) return;

    try {
      await api.put("/transaction/delete", { ids: selectedIds });
      await fetchTransactions();
      setSelectedIds([]);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting transactions");
    }
  };
   

  const closeModal = () => setPreviewImage(null);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div className="p-6 overflow-x-auto relative">
  {/* Filter */}
  <Filter
    fetchTransactions={fetchTransactions}
    setLoading={setLoading}
    setTransactions={setTransactions}
  />

  {/* Top Actions */}
  <div className="flex gap-3 mb-4 pt-4">
    <button
      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-red-700 transition"
      disabled={selectedIds.length === 0}
      onClick={handleDeleteSelected}
    >
      Delete Selected
    </button>
    <Upload />
  </div>

  <h2 className="text-2xl font-bold mb-4">All Transactions</h2>

  {loading ? (
    <p className="text-gray-500">Loading...</p>
  ) : currentTransactions.length === 0 ? (
    <p className="text-gray-500 italic">No transactions found.</p>
  ) : (
    <div className="bg-white rounded-xl shadow overflow-x-auto border border-gray-200">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            {transactionHeading.map((title, i) => (
              <th
                key={i}
                className="text-left px-6 py-3 font-semibold tracking-wide"
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
              className={`hover:bg-gray-50 transition ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* Checkbox */}
              <td className="px-6 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-blue-600"
                  checked={selectedIds.includes(txn.id)}
                  onChange={() => handleCheckboxChange(txn.id)}
                />
              </td>

              <td className="px-6 py-3">{formatDate(txn.transactionDate)}</td>
              <td className="px-6 py-3">{txn.chequeOrRef}</td>
              <td className="px-6 py-3">{formatDate(txn.valueDate)}</td>
              <td className="px-6 py-3">{txn.description}</td>
              <td className="px-6 py-3 font-semibold text-green-700">
                ₹{txn.amount.toLocaleString()}
              </td>
              <td className="px-6 py-3">{txn.amountType}</td>
              <td className="px-6 py-3">₹{txn.balance.toLocaleString()}</td>
              <td className="px-6 py-3">{txn.balanceType}</td>
              <td className="px-6 py-3">{txn.invoice}</td>

              {/* Attachments Section */}
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setShowAttachments((prev) => ({
                        ...prev,
                        [txn.id]: !prev[txn.id],
                      }))
                    }
                    title="View Attachments"
                    className="hover:opacity-80 transition cursor-pointer"
                  >
                    {showAttachments[txn.id] ? (
                      <Image src={hideLog} alt="Hide" className="w-4 h-4" />
                    ) : (
                      <Image src={viewLogo} alt="View" className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expandable Section */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showAttachments[txn.id]
                      ? "max-h-96 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {txn.files?.length > 0 && <ShowAttachemnts txn={txn} />}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  {/* Add Attachment */}
                  <button
                    onClick={() => {
                      setUploadTxnId(txn.id);
                      setShowUploadModal(true);
                    }}
                    title="Add Attachment"
                    className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    <RiAddCircleLine size={18} />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setSelectedTxn(txn);
                      setIsPopupOpen(true);
                    }}
                    title="Edit Transaction"
                    className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
                  >
                    ✏️
                  </button>

                  {/* Snapshot */}
                  <Link href={`/snapshots?id=${txn?.id}`} title="View Snapshot">
                    <button className="text-gray-600 hover:text-gray-800 transition cursor-pointer">
                      📷
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-5 items-center p-4 bg-gray-50 border-t">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
        >
          Back
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  )}

  {previewImage && (
    <PreviewImage previewImage={previewImage} closeModal={closeModal} />
  )}

  {showUploadModal && (
    <ShowUpload
      setUploadTxnId={setUploadTxnId}
      uploadTxnId={uploadTxnId}
      fetchTransactions={fetchTransactions}
      setShowUploadModal={setShowUploadModal}
    />
  )}

  {/* ✅ Edit Popup */}
  {isPopupOpen && (
    <EditPopup
      isOpen={isPopupOpen}
      data={selectedTxn}
      onClose={() => setIsPopupOpen(false)}
      onUpdated={fetchTransactions}
    />
  )}
</div>

  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default Transactions;
