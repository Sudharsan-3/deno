"use client";
import api from "@/lib/axios";
import React, { useState } from "react";
import { FaSearch, FaRedoAlt, FaFilter } from "react-icons/fa";
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
    <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
    {/* Top Row: Quick Filters */}
    <div className="flex flex-col gap-3 sm:flex-col md:flex-row md:items-center">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Description"
          value={filters.description}
          onChange={(e) =>
            setFilters({ ...filters, description: e.target.value })
          }
          className="border px-3 py-1.5 rounded-md text-sm focus:ring focus:ring-blue-300 w-full sm:w-auto"
        />
  
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm focus:ring focus:ring-blue-300 w-full sm:w-auto"
        />
  
        <select
          value={filters.tt}
          onChange={(e) => setFilters({ ...filters, tt: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm focus:ring focus:ring-blue-300 w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="CR">Credit</option>
          <option value="DR">Debit</option>
        </select>
  
        <label className="flex items-center gap-1 text-sm w-full sm:w-auto">
          <input
            type="checkbox"
            checked={filters.attachment}
            onChange={(e) =>
              setFilters({ ...filters, attachment: e.target.checked })
            }
            className="w-4 h-4 accent-blue-500"
          />
          With Files
        </label>
  
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 flex items-center gap-1 text-sm hover:underline w-full sm:w-auto"
        >
          <FaFilter /> {showAdvanced ? "Hide" : "More"}
        </button>
      </div>
    </div>
  
    {/* Advanced Filters */}
    {showAdvanced && (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className="border px-3 py-1.5 rounded-md text-sm"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
          className="border px-3 py-1.5 rounded-md text-sm"
          placeholder="End Date"
        />
        <input
          type="number"
          placeholder="Credit Min"
          value={filters.crMin}
          onChange={(e) => setFilters({ ...filters, crMin: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm"
        />
        <input
          type="number"
          placeholder="Credit Max"
          value={filters.crMax}
          onChange={(e) => setFilters({ ...filters, crMax: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm"
        />
        <input
          type="number"
          placeholder="Debit Min"
          value={filters.drMin}
          onChange={(e) => setFilters({ ...filters, drMin: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm"
        />
        <input
          type="number"
          placeholder="Debit Max"
          value={filters.drMax}
          onChange={(e) => setFilters({ ...filters, drMax: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm"
        />
        <input
          type="text"
          placeholder="Reference No."
          value={filters.refNo || ""}
          onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
          className="border px-3 py-1.5 rounded-md text-sm"
        />
      </div>
    )}
  
    {/* Action Buttons */}
    <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleFilter} className="bg-blue-600 flex items-center justify-center gap-1 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700">
          <FaSearch /> Apply
        </button>
        <button onClick={resetFilters} className="bg-gray-500 flex items-center justify-around gap-1 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-600">
          <FaRedoAlt /> Reset
        </button>
      </div>

      <DownloadExport filters={filters} />
    </div>

  </div>
  
  );
};

export default Filter;
