"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import DownloadExport from "./DownloadExport";
import Search from "./Search";

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
  const [uploadFile, setUploadFile] = useState(null);
  const [filters, setFilters] = useState({
    description: "",
    date: "",
    startDate: "",
    endDate: "",
    attachment: false,
    tt: "",
    crMin: "",
    crMax: "",
    drMin: "",
    drMax: "",
    refNo: "",
  });




  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/transaction/all");
      console.log(resp.data,"from ui frontend get all transaction")
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

  const handleFilter = async () => {
    setLoading(true);
    try {
      const payload = {
        description: filters.description || undefined,
        date: filters.date ? `${filters.date} 00:00:00` : undefined,
        startDate: filters.startDate ? `${filters.startDate} 00:00:00` : undefined,
        endDate: filters.endDate ? `${filters.endDate} 00:00:00` : undefined,
        attachment: filters.attachment || undefined,
        tt: filters.tt || undefined,
        crMin: filters.crMin !== "" ? Number(filters.crMin) : undefined,
        crMax: filters.crMax !== "" ? Number(filters.crMax) : undefined,
        drMin: filters.drMin !== "" ? Number(filters.drMin) : undefined,
        drMax: filters.drMax !== "" ? Number(filters.drMax) : undefined,
        refNo: filters.refNo || undefined,
      };

      const res = await api.post("/transaction/filter", payload);
      // console.log(res,"from filter")
      // console.log(res.data.message, "from filter API response");
      // console.log(res.data.data.data, "filtered transaction array");

      // **IMPORTANT: set transactions to the array, not whole object**
      setTransactions(res.data.data.data || []);

      if (res.data.data.length === 0) {
        alert("No transactions found matching your criteria.");
      }
    } catch (error) {
      console.error("Filter failed:", error);
      alert("Failed to filter transactions");
    } finally {
      setLoading(false);
    }
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
    const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}` ||`https://deno-88tn.onrender.com/${file.filePath.replace(/\\/g, "/")}`;
    if (file.fileType.startsWith("image/")) {
      setPreviewImage(fileUrl);
    } else {
      window.open(fileUrl, "_blank");
    }
  };



  // Updated handleUploadAttachment function
  const handleUploadAttachment = async () => {
    if (!uploadTxnId || !uploadFile?.length) {
      alert("Please select one or more files.");
      return;
    }

    const formData = new FormData();
    formData.append("transactionId", uploadTxnId);
    Array.from(uploadFile).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post("/transaction/upload/attachments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully!");
      setUploadFile(null);
      setUploadTxnId(null);
      setShowUploadModal(false);
      fetchTransactions();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error uploading files.");
    }
  };


  // console.log(filters, "from frontend filter")
  // console.log(transactions, "from frontend filter")

  const closeModal = () => setPreviewImage(null);

  return (
    <div className="p-4 overflow-x-auto relative">
      <Search  data={setTransactions} />
      <DownloadExport filters={filters}  />
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>

      {/* Filter UI */}
      {/* Filter UI */}
      <div className="mb-4 space-y-2">
        <h3 className="text-lg font-semibold">Filter Transactions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Description"
            value={filters.description}
            onChange={(e) => setFilters({ ...filters, description: e.target.value })}
            className="border px-3 py-1 rounded"
          />

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <div>
            <label htmlFor="text">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          </div>
          <div>
            <label htmlFor="text">End date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          </div>
          

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.attachment}
              onChange={(e) => setFilters({ ...filters, attachment: e.target.checked })}
            />
            With Attachments
          </label>

          <select
            value={filters.tt}
            onChange={(e) => setFilters({ ...filters, tt: e.target.value })}
            className="border px-3 py-1 rounded"
          >
            <option value="">All Types</option>
            <option value="CR">Credit</option>
            <option value="DR">Debit</option>
          </select>

          <input
            type="number"
            placeholder="Credit Min"
            value={filters.crMin}
            onChange={(e) => setFilters({ ...filters, crMin: e.target.value })}
            className="border px-3 py-1 rounded"
          />

          <input
            type="number"
            placeholder="Credit Max"
            value={filters.crMax}
            onChange={(e) => setFilters({ ...filters, crMax: e.target.value })}
            className="border px-3 py-1 rounded"
          />

          <input
            type="number"
            placeholder="Debit Min"
            value={filters.drMin}
            onChange={(e) => setFilters({ ...filters, drMin: e.target.value })}
            className="border px-3 py-1 rounded"
          />

          <input
            type="number"
            placeholder="Debit Max"
            value={filters.drMax}
            onChange={(e) => setFilters({ ...filters, drMax: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Reference No."
            value={filters.refNo || ""}
            onChange={(e) =>
              setFilters({ ...filters, refNo: e.target.value })
            }
            className="border px-3 py-1 rounded"
          />


          <div className="flex gap-2 mt-2 sm:col-span-2 lg:col-span-3">
            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setFilters({
                  description: "",
                  date: "",
                  attachment: false,
                  tt: "",
                  crMin: "",
                  crMax: "",
                  drMin: "",
                  drMax: "",
                  startDate:"",
                  endDate : "",
                });
                fetchTransactions();
              }}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>


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
            {transactions.length > 0 ?( transactions.map((txn, i) => (
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
                        const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}` ||`https://deno-88tn.onrender.com/${file.filePath.replace(/\\/g, "/")}`;
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
            ))): (
              <p>No transactions found</p>
            )}
          </tbody>
        </table>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-lg"
              onClick={closeModal}
            >✖</button>
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded" />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-lg"
              onClick={() => {
                setShowUploadModal(false);
                setUploadFile(null);
              }}
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold mb-4">Upload Attachments</h3>

            <label
              htmlFor="file-upload"
              className="block w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded cursor-pointer text-center text-gray-500 hover:bg-gray-100 transition"
            >
              {uploadFile?.length > 0
                ? `${uploadFile.length} file(s) selected`
                : "Click to select or drag files here"}
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={(e) => setUploadFile(e.target.files)}
                className="hidden"
              />
            </label>

            <button
              onClick={handleUploadAttachment}
              disabled={!uploadFile || uploadFile.length === 0}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </div>
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
