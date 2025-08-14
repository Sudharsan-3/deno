"use client"
import api from '@/lib/axios';
import React, { useState } from 'react'
import DownloadExport from '../DownloadExport';


const Filter = ({setLoading,setTransactions,fetchTransactions}) => {
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
        
    
  return (
    <div>
        <DownloadExport filters={filters}  />
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
      
    </div>
  )
}

export default Filter
