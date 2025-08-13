"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from "@/context/AuthContext";

export default function UploadTransaction() {
  const auth = useAuth();
  const userId = auth?.user?.id;

  const [file, setFile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.post('/getAccountByuser', { id: userId });
        setAccounts(res.data.data || []);
      } catch (err) {
        alert('Failed to load accounts');
      }
    };

    if (userId) fetchAccounts();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('⚠️ Please select a file');
    if (!selectedAccountId) return alert('⚠️ Please select an account');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('accountId', selectedAccountId);

    try {
      await api.post('/transaction/import/transactions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(' Transactions uploaded successfully');
      setFile(null);
      setSelectedAccountId('');
    } catch (err) {
      console.error(err?.response?.data || err);
      alert(' Upload failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">📤 Upload Transactions</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/*  File Input */}
        <div>
          <label className="block font-medium mb-1">Transaction File (.csv or .xls)</label>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/*  Account Dropdown */}
        <div>
          <label className="block font-medium mb-1">Select Account</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">-- Select Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - {acc.accountNo}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
