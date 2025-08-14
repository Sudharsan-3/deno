"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import Search from "./Search";
import Filter from "./transaction/Filter";
import ShowUpload from "./transaction/ShowUpload";
import PreviewImage from "./transaction/PreviewImage";

const transactionHeading = [
  "",
  "S.No",
  "Transaction Date",
  "ChequeOrfre",
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



  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/transaction/all");
      console.log(resp.data, "from ui frontend get all transaction")
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
    if (typeof window === "undefined") return; // prevent SSR crash

    const confirmDelete = window.confirm("Are you sure you want to delete selected transactions?");
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

  const handleViewFile = (file) => {
    if (typeof window === "undefined") return; // prevent SSR crash
    const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}` || `https://deno-88tn.onrender.com/${file.filePath.replace(/\\/g, "/")}`;
    if (file.fileType.startsWith("image/")) {
      setPreviewImage(fileUrl);
    } else {
      window.open(fileUrl, "_blank");
    }
  };
  const closeModal = () => setPreviewImage(null);

  return (
    <div className="p-4 overflow-x-auto relative">
      <Search data={setTransactions} />

      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
      {/* Filter UI */}
      <Filter fetchTransactions={fetchTransactions} setLoading={setLoading} setTransactions={setTransactions} />
   <div className="mb-3">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-md bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {transactionHeading.map((title, i) => (
                <th key={i} className="text-left px-4 py-2 border-b border-gray-200">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (transactions.map((txn, i) => (
              <tr key={txn.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 border-b">
                  <input type="checkbox" checked={selectedIds.includes(txn.id)} onChange={() => handleCheckboxChange(txn.id)} />
                </td>
                <td className="px-4 py-2 border-b">{i + 1}</td>
                <td className="px-4 py-2 border-b">{formatDate(txn.transactionDate)}</td>
                <td className="px-4 py-2 border-b">{(txn.chequeOrRef)}</td>
                <td className="px-4 py-2 border-b">{formatDate(txn.valueDate)}</td>
                <td className="px-4 py-2 border-b">{txn.description}</td>
                <td className="px-4 py-2 border-b">₹{txn.amount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{txn.amountType}</td>
                <td className="px-4 py-2 border-b">₹{txn.balance.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{txn.balanceType}</td>
                <td className="px-4 py-2 border-b">{txn.invoice}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAttachments(prev => ({ ...prev, [txn.id]: !prev[txn.id] }))}
                      className="text-blue-600 underline text-sm"
                    >
                      {showAttachments[txn.id] ? "Hide" : "Show"} Attachments
                    </button>
                    <button
                      onClick={() => { setUploadTxnId(txn.id); setShowUploadModal(true); }}
                      className="text-green-600 underline text-sm"
                    >
                      Add Attachment
                    </button>
                  </div>
                  {showAttachments[txn.id] && txn.files?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {txn.files.map((file) => {
                        const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}` || `https://deno-88tn.onrender.com/${file.filePath.replace(/\\/g, "/")}`;
                        const isImage = file.fileType.startsWith("image/");
                        return (
                          <button
                            key={file.id}
                            onClick={() => handleViewFile(file)}
                            className={`border rounded ${isImage ? "w-12 h-12 p-0" : "px-2 py-1 text-sm text-blue-600 underline"}`}
                          >
                            {isImage ? (
                              <img src={fileUrl} alt={file.fileName} className="w-full h-full object-cover rounded" />
                            ) : (
                              file.fileName.length > 12 ? file.fileName.slice(0, 10) + "..." : file.fileName
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => { setSelectedIds([txn.id]); handleDeleteSelected(); }}
                    className="text-red-600 underline text-sm"
                  >Delete</button>
                  <div className="h-auto flex items-center justify-center">
                    <EditButton onClick={() => handleEditClick(txn)} />
                    <EditPopup
                      isOpen={isPopupOpen}
                      data={selectedTxn}
                      onClose={() => setIsPopupOpen(false)}
                      onUpdated={fetchTransactions} // refresh after update
                    />
                  </div>
                </td>
              </tr>
            ))) : (
              <p>No transactions found</p>
            )}
          </tbody>
        </table>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <PreviewImage previewImage={previewImage} closeModal={closeModal} />
      )}

      {/* Upload Modal */}
      {showUploadModal && (       
         <ShowUpload setUploadTxnId={setUploadTxnId} uploadTxnId={uploadTxnId} fetchTransactions={fetchTransactions} setShowUploadModal={setShowUploadModal} />
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
