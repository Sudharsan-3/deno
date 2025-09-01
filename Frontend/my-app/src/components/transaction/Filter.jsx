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
        className="filter-btn bg-pink-500 rounded-full text-white py-2 px-4 flex items-center justify-center gap-2 hover:bg-pink-600 transition shadow-md"
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="w-full sm:w-[450px] h-full bg-white shadow-lg flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 bg-pink-50 border-b border-pink-200">
                <h2 className="text-pink-700 font-bold text-lg flex items-center gap-2">
                  <FaFilter className="text-pink-600" />
                  Filter Transactions
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-pink-500 hover:text-red-600 text-xl"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Search by description"
                    value={filters.description}
                    onChange={(e) =>
                      setFilters({ ...filters, description: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  />
                </div>

                {/* Reference Number */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter reference number"
                    value={filters.refNo}
                    onChange={(e) =>
                      setFilters({ ...filters, refNo: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  />
                </div>

                {/* Account Select */}
                <select
                  value={selectedAccountId}
                  onChange={(e) => handelSelect(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  disabled={accounts.length === 0}
                >
                  <option value="">All Accounts</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - {acc.accountNo}
                    </option>
                  ))}
                </select>

                {/* Sections */}
                {/* Date Range */}
                <div className="mb-4 border rounded-lg">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("dateRange")}
                  >
                    <h3 className="font-medium text-gray-700">Date Range</h3>
                    {expandedSections.dateRange ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {expandedSections.dateRange && (
                    <div className="p-3 space-y-3">
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) =>
                          setFilters({ ...filters, date: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) =>
                            setFilters({ ...filters, startDate: e.target.value })
                          }
                          className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                        />
                        <input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                          }
                          className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount Range */}
                <div className="mb-4 border rounded-lg">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("amountRange")}
                  >
                    <h3 className="font-medium text-gray-700">Amount Range</h3>
                    {expandedSections.amountRange ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {expandedSections.amountRange && (
                    <div className="p-3 grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Credit Min"
                        value={filters.crMin}
                        onChange={(e) =>
                          setFilters({ ...filters, crMin: e.target.value })
                        }
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Credit Max"
                        value={filters.crMax}
                        onChange={(e) =>
                          setFilters({ ...filters, crMax: e.target.value })
                        }
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Debit Min"
                        value={filters.drMin}
                        onChange={(e) =>
                          setFilters({ ...filters, drMin: e.target.value })
                        }
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Debit Max"
                        value={filters.drMax}
                        onChange={(e) =>
                          setFilters({ ...filters, drMax: e.target.value })
                        }
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Other Filters */}
                <div className="border rounded-lg">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("otherFilters")}
                  >
                    <h3 className="font-medium text-gray-700">Other Filters</h3>
                    {expandedSections.otherFilters ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {expandedSections.otherFilters && (
                    <div className="p-3 space-y-3">
                      <select
                        value={filters.tt}
                        onChange={(e) =>
                          setFilters({ ...filters, tt: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="">All Types</option>
                        <option value="CR">Credit</option>
                        <option value="DR">Debit</option>
                      </select>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.attachment}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              attachment: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-pink-500"
                        />
                        Only transactions with attachments
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <FaRedoAlt /> Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition shadow-md"
                >
                  <FaSearch /> Apply
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


