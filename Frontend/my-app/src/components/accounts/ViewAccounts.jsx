"use client";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import EditAccountModal from "./EditAccountModal";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";

const ViewAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const getAccounts = async () => {
    try {
      const response = await api.get("/getAccountByuser");
      setAccounts(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  const handleUpdateSuccess = () => {
    getAccounts();
    handleCloseModal();
  };

  const handleDeleteClick = (account) => {
    setDeleteConfirm(account);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setLoadingDelete(true);
    try {
      await api.delete("/account/delete", {
        data: { accountId: deleteConfirm.id },
      });
      getAccounts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
  {/* Header */}
  <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
    Registered Accounts
  </h2>

  {accounts.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl text-gray-900 truncate">
              {account.name}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleEditClick(account)}
                title="Edit Account"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <RiEditLine size={22} />
              </button>
              <button
                onClick={() => handleDeleteClick(account)}
                title="Delete Account"
                className="text-red-600 hover:text-red-800 transition"
              >
                <RiDeleteBin6Line size={22} />
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {account.address || "-"}
            </p>
            <p>
              <span className="font-semibold">Account No:</span>{" "}
              {account.accountNo || "-"}
            </p>
            <p>
              <span className="font-semibold">Branch:</span>{" "}
              {account.branch || "-"}
            </p>
            <p>
              <span className="font-semibold">IFSC:</span>{" "}
              {account.ifsc || "-"}
            </p>
            <p>
              <span className="font-semibold">MICR:</span>{" "}
              {account.micr || "-"}
            </p>
            {account.currency && account.currency !== "null" && (
              <p>
                <span className="font-semibold">Currency:</span>{" "}
                {account.currency}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <h1 className="text-gray-500 text-lg text-center mt-6">
      No accounts found.
    </h1>
  )}

  {/* Edit Modal */}
  {showModal && (
    <EditAccountModal
      account={selectedAccount}
      onClose={handleCloseModal}
      onUpdateSuccess={handleUpdateSuccess}
    />
  )}

  {/* Delete Confirmation Modal */}
  {deleteConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center animate-fadeIn">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">
            {deleteConfirm.name}
          </span>
          ?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={loadingDelete}
            className={`px-6 py-2 rounded-lg text-white flex items-center justify-center ${
              loadingDelete
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loadingDelete ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default ViewAccounts;
