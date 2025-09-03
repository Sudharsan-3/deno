"use client";

// import api from "@/lib/axios";
import api from "../lib/axios"
import React, { useEffect, useState } from "react";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import { RiAddCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Filter from "./transaction/Filter";
import ShowUpload from "./transaction/ShowUpload";
import PreviewImage from "./transaction/PreviewImage";
import ShowAttachemnts from "./transaction/ShowAttachemnts";
import Image from "next/image";
// import viewLogo from "@/app/public/show-svgrepo-com.svg";
// import hideLog from "@/app/public/hide-svgrepo-com.svg";
import Upload from "./transaction/Upload";
import Link from "next/link";
import DownloadExport from "./DownloadExport";
import History from "./History";


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
  const [historyShow, setHistoryShow] = useState(false)

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
    <div className="px-5 overflow-x-auto relative">
      {/* Top Actions */}


      <div className="flex my-2 flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-transparent shadow-md rounded-lg">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">

          All Transactions
        </h2>

        {/* Right Section */}
        <div className="flex flex-col xs:flex-row justify-end items-stretch xs:items-center gap-3 w-full md:w-auto">
          {/* Action Buttons Container */}
          <div className="flex flex-wrap justify-start xs:justify-end  items-center gap-3">
            {/* Upload */}
            <div className="flex-shrink-0">
              <Upload />
            </div>

            {/* Filter */}
            <div className="flex-shrink-0">
              <Filter
                fetchTransactions={fetchTransactions}
                setLoading={setLoading}
                setTransactions={setTransactions}
              />
            </div>

            {/* Delete Button */}
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4 py-2 text-sm md:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap shadow-md flex items-center justify-center min-h-[40px] min-w-[90px]"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              {selectedIds.length > 0 ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete ({selectedIds.length})
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>

          {/* Selected count for mobile */}
          {selectedIds.length > 0 && (
            <div className="xs:hidden bg-pink-100 text-pink-800 px-3 py-2 rounded-lg text-sm font-medium">
              {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : currentTransactions.length === 0 ? (
        <p className="text-gray-500 italic overflow-auto">No transactions found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
          <table className="min-w-full table-auto">
            {/* Table Header */}
            <thead className="bg-black text-white text-sm uppercase">
              <tr>
                {/* Select All Checkbox */}
                <th className="px-4 py-3 border-b border-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === currentTransactions.length &&
                      currentTransactions.length > 0
                    }
                    onChange={() => {
                      if (selectedIds.length === currentTransactions.length) {
                        // Deselect all
                        setSelectedIds([]);
                      } else {
                        // Select all on current page
                        setSelectedIds(currentTransactions.map((txn) => txn.id));
                      }
                    }}
                    className="w-5 h-5 accent-pink-600 cursor-pointer"
                  />
                </th>

                {/* Other headers */}
                {transactionHeading.slice(1).map((title, i) => (
                  <th
                    key={i}
                    className="text-left px-6 py-3 font-semibold tracking-wide border-b border-gray-700"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>


            {/* Table Body */}
            <tbody>
              {currentTransactions.map((txn, i) => (
                <tr
                  key={txn.id}
                  className={`hover:bg-pink-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  {/* Checkbox */}
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-pink-600"
                      checked={selectedIds.includes(txn.id)}
                      onChange={() => handleCheckboxChange(txn.id)}
                    />
                  </td>

                  {/* Transaction Details */}
                  <td className="px-6 py-3 text-gray-700">{formatDate(txn.transactionDate)}</td>
                  <td className="px-6 py-3 text-gray-700">{txn.chequeOrRef}</td>
                  <td className="px-6 py-3 text-gray-700">{formatDate(txn.valueDate)}</td>
                  <td className="px-6 py-3 text-gray-800 font-medium">{txn.description}</td>
                  <td
                    className={`px-6 py-3 font-semibold ${txn.amountType === "Credit" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{txn.amountType}</td>
                  <td className="px-6 py-3 text-gray-700">₹{txn.balance.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-700">{txn.balanceType}</td>
                  <td className="px-6 py-3 text-gray-600">{txn.invoice}</td>

                  {/* Attachments Section */}
                  <td className="px-6 py-3">
                    <ShowAttachemnts txn={txn} />

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
                        className="text-pink-600 hover:text-pink-800 transition cursor-pointer"
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
                        className="text-gray-600 hover:text-black transition cursor-pointer"
                      >
                        ✏️
                      </button>

                      {/* Snapshot */}
                      <Link href={`/snapshots?id=${txn?.id}`} title="View Snapshot">
                        <button className="text-gray-600 hover:text-black transition cursor-pointer">
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 border-t">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-700 transition"
              >
                Back
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-700 transition"
              >
                Next
              </button>
            </div>
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

      <div className="flex flex-col items-center mt-6">
        {/* Toggle Button */}
        <button
          onClick={() => setHistoryShow(!historyShow)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
        >
          {historyShow ? "Hide History" : "Show History"}
        </button>

        {/* Animated History Section */}
        <AnimatePresence>
          {historyShow && (
            <motion.div
              key="history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden w-full mt-4"
            >
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <History />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* {
          historyShow?(<div>
      <History /> <button onClick={()=>setHistoryShow(false)} >Hide history</button>
     </div> ): (<button onClick={()=>setHistoryShow(true)}>Show history</button>)
          
        } */}



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
