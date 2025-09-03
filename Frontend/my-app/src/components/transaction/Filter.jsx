"use client";
// import api from "@/lib/axios";
import api from "../../lib/axios"

import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import DownloadExport from "../DownloadExport";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

const Filter = ({ setLoading, setTransactions, fetchTransactions }) => {
  const auth = useAuth();
  const userId = auth?.user?.id;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
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
    accountId: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dateRange: true,
    amountRange: true,
    otherFilters: true,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/getAccountByuser");
        setAccounts(res.data.data || []);
      } catch (err) {
        alert("⚠️ Failed to load accounts");
      }
    };

    if (userId) fetchAccounts();
  }, [userId]);

  const handelSelect = (value) => {
    setSelectedAccountId(value);
    setFilters({ ...filters, accountId: value });
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const payload = {
        description: filters.description || undefined,
        date: filters.date ? `${filters.date} 00:00:00` : undefined,
        startDate: filters.startDate
          ? `${filters.startDate} 00:00:00`
          : undefined,
        endDate: filters.endDate ? `${filters.endDate} 00:00:00` : undefined,
        attachment: filters.attachment || undefined,
        tt: filters.tt || undefined,
        crMin: filters.crMin !== "" ? Number(filters.crMin) : undefined,
        crMax: filters.crMax !== "" ? Number(filters.crMax) : undefined,
        drMin: filters.drMin !== "" ? Number(filters.drMin) : undefined,
        drMax: filters.drMax !== "" ? Number(filters.drMax) : undefined,
        refNo: filters.refNo || undefined,
        accountId: filters.accountId || undefined,
      };

      const res = await api.post("/transaction/filter", payload);
      setTransactions(res.data.data.data || []);

      if (res.data.data.length === 0) {
        alert("No transactions found matching your criteria.");
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Filter failed:", error);
      alert("Failed to filter transactions");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      description: "",
      date: "",
      attachment: false,
      tt: "",
      crMin: "",
      crMax: "",
      drMin: "",
      drMax: "",
      startDate: "",
      endDate: "",
      refNo: "",
      accountId: "",
    });
    fetchTransactions();
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="relative flex items-center gap-4">
      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="filter-btn bg-pink-500 rounded-xl text-white py-2 px-4 flex items-center justify-center gap-2 hover:bg-pink-600 transition shadow-md"
      >
        <FaFilter size={15} />
        Filter
      </button>

      {/* Download Export Button */}
      <DownloadExport
        filters={filters}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition shadow-md"
      />

      {/* Popup (Framer Motion with full-screen mobile support) */}
      <AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-end items-start z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-[90%] sm:w-[380px] bg-white rounded-lg shadow-xl p-5 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowFilters(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Advanced Filters
          </h2>
          <p className="text-sm text-gray-500">
            Filter your transactions by specific criteria.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4">
          {/* ✅ Account Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => handelSelect(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring focus:ring-blue-200"
              disabled={accounts.length === 0}
            >
              <option value="">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - {acc.accountNo}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters({ ...filters, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Description & Ref No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                value={filters.description}
                onChange={(e) =>
                  setFilters({ ...filters, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ref No.
              </label>
              <input
                type="text"
                placeholder="Reference"
                value={filters.refNo}
                onChange={(e) =>
                  setFilters({ ...filters, refNo: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Credit & Debit Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Range (Income)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.crMin}
                onChange={(e) =>
                  setFilters({ ...filters, crMin: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.crMax}
                onChange={(e) =>
                  setFilters({ ...filters, crMax: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit Range (Expenses)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.drMin}
                onChange={(e) =>
                  setFilters({ ...filters, drMin: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.drMax}
                onChange={(e) =>
                  setFilters({ ...filters, drMax: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <div className="flex gap-4 text-sm text-gray-600">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tt"
                  value=""
                  checked={filters.tt === ""}
                  onChange={() => setFilters({ ...filters, tt: "" })}
                />
                All
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tt"
                  value="DR"
                  checked={filters.tt === "DR"}
                  onChange={() => setFilters({ ...filters, tt: "DR" })}
                />
                Debit (DR)
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="tt"
                  value="CR"
                  checked={filters.tt === "CR"}
                  onChange={() => setFilters({ ...filters, tt: "CR" })}
                />
                Credit (CR)
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.attachment}
                onChange={(e) =>
                  setFilters({ ...filters, attachment: e.target.checked })
                }
                className="w-4 h-4"
              />
              Has Attachments
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 flex justify-between">
          <button
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Reset Filters
          </button>
          <button
            onClick={handleFilter}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
};

export default Filter;


