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


const transactionHeading = [
  "",
  "S.No",
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
    <div className="p-4 overflow-x-auto relative">


      
      {/* Filter */}
      <Filter
        fetchTransactions={fetchTransactions}
        setLoading={setLoading}
        setTransactions={setTransactions}
      />

      <div className=" flex gep-3 mb-3 pt-2">
        <button
          className="bg-red-800 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-red-700 transition"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
        <Upload />
      </div>
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>


      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : currentTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {transactionHeading.map((title, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-2 border-b border-gray-200"
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
                  className={`hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="px-4 py-2 border-b">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(txn.id)}
                      onChange={() => handleCheckboxChange(txn.id)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    {indexOfFirst + i + 1}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {formatDate(txn.transactionDate)}
                  </td>
                  <td className="px-4 py-2 border-b">{txn.chequeOrRef}</td>
                  <td className="px-4 py-2 border-b">
                    {formatDate(txn.valueDate)}
                  </td>
                  <td className="px-4 py-2 border-b">{txn.description}</td>
                  <td className="px-4 py-2 border-b">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b">{txn.amountType}</td>
                  <td className="px-4 py-2 border-b">
                    ₹{txn.balance.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b">{txn.balanceType}</td>
                  <td className="px-4 py-2 border-b">{txn.invoice}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setShowAttachments((prev) => ({
                            ...prev,
                            [txn.id]: !prev[txn.id],
                          }))
                        }
                        className="w-5 underline text-sm transform-full hover:cursor-pointer"
                      >
                        {showAttachments[txn.id] ? (
                          <Image src={hideLog} alt="attachments" />
                        ) : (
                          <Image src={viewLogo} alt="attachments" />
                        )}
                      </button>
                    </div>

                    {/* Smooth expand/collapse */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${showAttachments[txn.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      {txn.files?.length > 0 && <ShowAttachemnts txn={txn} />}
                    </div>
                  </td>

                  <td className="px-4 py-2 border-b">
                    <div className="flex  items-center gap-2">
                      {/* Add Attachment Button */}
                      <button
                        onClick={() => {
                          setUploadTxnId(txn.id);
                          setShowUploadModal(true);
                        }}
                        title="Add Attachment"
                        className="px-2 py-1  text-black rounded hover:cursor-pointer"
                      >
                        <RiAddCircleLine size={16} />
                      </button>

                      {/* Edit Button */}
                      <div>
                        <EditButton
                          onClick={() => handleEditClick(txn)}
                          title="Edit Transaction"
                        />
                      </div>
                    </div>

                    {/* Edit Popup */}
                    <EditPopup
                      isOpen={isPopupOpen}
                      data={selectedTxn}
                      onClose={() => setIsPopupOpen(false)}
                      onUpdated={fetchTransactions}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center gap-5 items-center p-4 bg-gray-50 border-t">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Back
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
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
