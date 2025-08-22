"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function DownloadExport({ filters }) {
  useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (type) => {
    setOpen(false); // close menu after click
    try {
      const response = await api.post(
        `/transaction/export-zip?format=${type}`,
        filters,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_with_attachments.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export file. Please try again.");
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="border border-transparent hover:border-blue-700 hover:text-blue-700 hover:cursor-pointer bg-white text-black px-4 py-2 rounded-lg shadow  transition flex items-center gap-2"
      >
        Export with Attachments
        <FaChevronDown
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border animate-fadeIn z-50">
          <button
            onClick={() => handleExport("csv")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            CSV + Attachments (ZIP)
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            Excel + Attachments (ZIP)
          </button>
        </div>
      )}
    </div>
  );
}
