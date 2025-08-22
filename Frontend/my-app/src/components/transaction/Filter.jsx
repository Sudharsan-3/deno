"use client";
import api from "@/lib/axios";
import React, { useState } from "react";
import { FaSearch, FaRedoAlt, FaFilter, FaCalendarAlt, FaFileExport } from "react-icons/fa";
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  return (
    <div className="mt-4">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Description Search */}
        <div className="bg-white  rounded-lg shadow-sm p-2 border border-transparent hover:border-blue-700">
          <input
            type="text"
            placeholder="Description"
            value={filters.description}
            onChange={(e) =>
              setFilters({ ...filters, description: e.target.value })
            }
            className="px-2 py-1 text-sm focus:outline-none w-32 md:w-40"
          />
        </div>

        {/* Date Selector with Icon */}
        <div className="relative bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-700">
          <button 
            className="p-2 flex items-center"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FaCalendarAlt className="text-gray-600" />
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white p-3 rounded-lg shadow-lg border border-transparent hover:border-blue-700 z-10 w-64">
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">Specific Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full border border-transparent hover:border-blue-700 px-2 py-1 rounded text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer px-2 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer px-2 py-1 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Type */}
        <div className="bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer">
          <select
            value={filters.tt}
            onChange={(e) => setFilters({ ...filters, tt: e.target.value })}
            className="px-3 py-1.5 rounded-lg text-sm focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="CR">Credit</option>
            <option value="DR">Debit</option>
          </select>
        </div>

        {/* Attachment Filter */}
        <div className="bg-white rounded-lg shadow-sm p-2 border border-transparent hover:border-blue-700 hover:text-blue-700  flex items-center">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={filters.attachment}
              onChange={(e) =>
                setFilters({ ...filters, attachment: e.target.checked })
              }
              className="w-4 h-4 accent-blue-500 hover:cursor-pointer"
            />
            <span className="hidden md:inline">With Files</span>
            <span className="md:hidden">Files</span>
          </label>
        </div>

        {/* Reference Number */}
        <div className="bg-white rounded-lg shadow-sm p-1 border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer">
          <input
            type="text"
            placeholder="Ref No."
            value={filters.refNo || ""}
            onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
            className="px-2 py-1 text-sm focus:outline-none w-20 md:w-28"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleFilter} 
            className="bg-white border flex items-center justify-center gap-1 text-black px-3 py-1.5 rounded-lg text-sm border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer shadow-sm"
          >
            <FaSearch size={12} /> 
            <span className="hidden md:inline">Apply</span>
          </button>
          
          <button 
            onClick={resetFilters} 
            className="bg-white flex items-center justify-center gap-1 text-black px-3 py-1.5 rounded-lg text-sm  shadow-sm border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer"
          >
            <FaRedoAlt size={12} /> 
            <span className="hidden md:inline">Reset</span>
          </button>
          
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="bg-white flex items-center justify-center gap-1 text-black px-3 py-1.5 rounded-lg text-sm border-transparent border hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer"
          >
            <FaFilter size={12} /> 
            <span className="hidden md:inline">More</span>
          </button>

          <DownloadExport filters={filters} />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Amount Filters</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Credit Min</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.crMin}
                onChange={(e) => setFilters({ ...filters, crMin: e.target.value })}
                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Credit Max</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.crMax}
                onChange={(e) => setFilters({ ...filters, crMax: e.target.value })}
                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Debit Min</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.drMin}
                onChange={(e) => setFilters({ ...filters, drMin: e.target.value })}
                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Debit Max</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.drMax}
                onChange={(e) => setFilters({ ...filters, drMax: e.target.value })}
                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;