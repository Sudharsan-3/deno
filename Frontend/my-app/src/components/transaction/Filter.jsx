"use client";
import api from "@/lib/axios";
import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaRedoAlt, FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DownloadExport from "../DownloadExport";

const Filter = ({ setLoading, setTransactions, fetchTransactions }) => {
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

  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dateRange: true,
    amountRange: true,
    otherFilters: true
  });
  const popupRef = useRef(null);

  // Close on outside click
  // Close on outside click (improved)
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !event.target.closest(".filter-btn") // Ignore clicks on button
    ) {
      setShowFilters(false);
    }
  };
  if (showFilters) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showFilters]);

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
    });
    fetchTransactions();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="relative flex items-center gap-4">
      {/* Filter Button */}

      
      <button
  onClick={(e) => {
    e.stopPropagation(); // Prevent closing immediately
    setShowFilters((prev) => !prev);
  }}
  className="filter-btn bg-pink-500 rounded-full text-white py-2 px-4 flex items-center justify-center gap-2 hover:bg-pink-600 transition shadow-md"
>
  <FaFilter size={15} />
  Filter
  {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
</button>

      {/* Download Export Button */}
      <DownloadExport
        filters={filters}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition shadow-md"
      />

      {/* Popup Panel */}
      {showFilters && (
        <div
          ref={popupRef}
          className="absolute top-full right-0 mt-2 w-96 bg-white shadow-xl border border-pink-200 rounded-lg z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-pink-50 border-b border-pink-200 rounded-t-lg">
            <h2 className="text-pink-700 font-bold text-lg flex items-center gap-2">
              <FaFilter className="text-pink-600" />
              Filter Transactions
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-pink-500 hover:text-red-600 text-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Filter Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Search Term */}
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
                onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
              />
            </div>

            {/* Date Range Section */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection('dateRange')}
              >
                <h3 className="font-medium text-gray-700">Date Range</h3>
                {expandedSections.dateRange ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {expandedSections.dateRange && (
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Single Date</label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                          setFilters({ ...filters, startDate: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                          setFilters({ ...filters, endDate: e.target.value })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amount Range Section */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection('amountRange')}
              >
                <h3 className="font-medium text-gray-700">Amount Range</h3>
                {expandedSections.amountRange ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {expandedSections.amountRange && (
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Credit Min</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.crMin}
                        onChange={(e) => setFilters({ ...filters, crMin: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Credit Max</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.crMax}
                        onChange={(e) => setFilters({ ...filters, crMax: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Debit Min</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.drMin}
                        onChange={(e) => setFilters({ ...filters, drMin: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Debit Max</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.drMax}
                        onChange={(e) => setFilters({ ...filters, drMax: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Filters Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection('otherFilters')}
              >
                <h3 className="font-medium text-gray-700">Other Filters</h3>
                {expandedSections.otherFilters ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {expandedSections.otherFilters && (
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                    <select
                      value={filters.tt}
                      onChange={(e) => setFilters({ ...filters, tt: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="CR">Credit</option>
                      <option value="DR">Debit</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.attachment}
                      onChange={(e) =>
                        setFilters({ ...filters, attachment: e.target.checked })
                      }
                      className="w-4 h-4 accent-pink-500"
                    />
                    Only transactions with attachments
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              <FaRedoAlt />
              Reset All
            </button>
            <button
              onClick={handleFilter}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition shadow-md"
            >
              <FaSearch />
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;