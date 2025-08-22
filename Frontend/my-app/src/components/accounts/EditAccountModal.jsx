"use client";
import React, { useState } from "react";
import api from "@/lib/axios";


const EditAccountModal = ({ account, onClose, onUpdateSuccess }) => {
  

  const [formData, setFormData] = useState({
    name: account.name || "",
    address: account.address || "",
    accountNo: account.accountNo || "",
    branch: account.branch || "",
    ifsc: account.ifsc || "",
    micr: account.micr || "",
    currency: account.currency ? account.currency.toUpperCase() : "",
    custRelnNo: account.custRelnNo || "",
    startDate: account.startDate || "",
    endDate: account.endDate || "",
  });

  const currencies = [
    "INR", "USD", "EUR", "GBP", "AUD", "CAD", "JPY", "CNY", "SGD", "CHF"
  ];
  console.log(account,"from edit")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "currency" ? value.toUpperCase() : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.put("/account/update", {
        ...formData,
        accountId: account?.id, // keeping original creator
      });
      onUpdateSuccess();
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-blend-lighten bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Account Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Account Name"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleChange}
            placeholder="Account No"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="ifsc"
            value={formData.ifsc}
            onChange={handleChange}
            placeholder="IFSC"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="micr"
            value={formData.micr}
            onChange={handleChange}
            placeholder="MIRC"
            className="border rounded p-2"
          />

          {/* Currency Dropdown */}
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="">Select Currency</option>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="custRelnNo"
            value={formData.custRelnNo}
            onChange={handleChange}
            placeholder="Customer Reln No"
            className="border rounded p-2"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
