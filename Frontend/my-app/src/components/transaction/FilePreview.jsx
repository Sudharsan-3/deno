"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiDownload } from "react-icons/fi";
import {
  AiOutlineFileExcel,
  AiOutlineFileText,
  AiOutlineFilePdf,
  AiOutlineFileUnknown,
} from "react-icons/ai";
import * as XLSX from "xlsx";

const FilePreview = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "file";

  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        ❌ Invalid file URL
      </div>
    );
  }

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);
  const isPDF = fileName.toLowerCase().endsWith(".pdf");
  const isCSV = fileName.toLowerCase().endsWith(".csv");
  const isText = fileName.toLowerCase().endsWith(".txt");
  const isExcel = /\.(xls|xlsx)$/i.test(fileName);
  const isDoc = /\.(doc|docx)$/i.test(fileName);

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        if (isCSV || isText) {
          const response = await fetch(fileUrl);
          const text = await response.text();
          setFileContent(text);
        }

        if (isExcel) {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // array of arrays
          setFileContent(data);
        }
      } catch (error) {
        console.error("Failed to fetch file content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isCSV || isText || isExcel) {
      fetchFileContent();
    } else {
      setLoading(false);
    }
  }, [fileUrl, isCSV, isText, isExcel]);

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

  const renderPreview = () => {
    if (loading) {
      return <p className="text-gray-500 text-center">Loading preview...</p>;
    }

    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[80vh] rounded-lg shadow-md"
        />
      );
    }

    if (isPDF) {
      return (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          className="w-full h-[80vh] border rounded-lg"
        ></iframe>
      );
    }

    if (isCSV) {
      const rows = fileContent ? fileContent.split("\n").map((row) => row.split(",")) : [];
      return (
        <div className="overflow-auto max-h-[80vh] w-full border rounded-lg bg-gray-50 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {rows.map((cols, i) => (
                <tr key={i} className="border-b">
                  {cols.map((col, j) => (
                    <td key={j} className="p-2 border">
                      {col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (isText) {
      return (
        <div className="w-full max-h-[80vh] overflow-auto bg-gray-50 p-4 rounded-lg border">
          <pre className="whitespace-pre-wrap">{fileContent}</pre>
        </div>
      );
    }

    if (isExcel) {
      return (
        <div className="overflow-auto max-h-[80vh] w-full border rounded-lg bg-gray-50 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {fileContent &&
                fileContent.map((row, i) => (
                  <tr key={i} className="border-b">
                    {row.map((cell, j) => (
                      <td key={j} className="p-2 border">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (isDoc) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <AiOutlineFileText size={80} className="text-blue-500" />
          <p className="mt-4 text-lg">Preview not available for Word files.</p>
          <p className="text-sm mt-2">Please download to view the file.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <AiOutlineFileUnknown size={80} className="text-gray-400" />
        <p className="mt-4 text-lg">Preview not available for this file type.</p>
        <p className="text-sm mt-2">Please download to view the file.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold truncate">{fileName}</h2>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
          >
            <FiDownload size={18} /> Download
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-4 flex justify-center bg-gray-50">{renderPreview()}</div>
      </div>
    </div>
  );
};

export default FilePreview;


