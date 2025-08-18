"use client";
import React from "react";
import { FiDownload, FiFileText, FiImage } from "react-icons/fi";

const ShowAttachemnts = ({ txn }) => {
  return (
    <div>
      <details className="mt-2">
        <summary className="cursor-pointer text-blue-600 font-medium">
          View
        </summary>
        <div className="flex flex-wrap gap-4 mt-3">
          {txn.files.map((file) => {
            const fileUrl = `https://deno-88tn.onrender.com/${file.filePath.replace(/\\/g, "/")}`||`http://localhost:5000/${file.filePath.replace(/\\/g, "/")}`;
            const isImage = file.fileType.startsWith("image/");

            return (
              <div
                key={file.id}
                className="flex  items-center gap-2 border p-1 rounded-lg shadow-sm bg-gray-50"
              >
                {/* Preview */}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 flex items-center justify-center rounded-lg bg-white border hover:shadow-md transition"
                >
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file.fileName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <FiFileText className="w-8 h-8 text-gray-700" />
                  )}
                </a>

                {/* Download button */}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const response = await fetch(fileUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiDownload className="w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
};

export default ShowAttachemnts;
