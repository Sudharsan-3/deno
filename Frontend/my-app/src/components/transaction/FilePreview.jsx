"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { FiDownload } from "react-icons/fi";

const FilePreview = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "file";

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        ❌ Invalid file URL
      </div>
    );
  }

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);
  const isPDF = fileName.toLowerCase().endsWith(".pdf");

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{fileName}</h2>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <FiDownload size={18} /> Download
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-4 flex justify-center bg-gray-50">
          {isImage ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-[80vh] rounded-lg shadow-md"
            />
          ) : isPDF ? (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              className="w-full h-[80vh] border rounded-lg"
            ></iframe>
          ) : (
            <div className="text-gray-600 text-center py-10">
              <p>Preview not available for this file type.</p>
              <p className="text-sm mt-2">Please download to view the file.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
