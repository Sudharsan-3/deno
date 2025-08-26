"use client";
import React, { useState } from "react";
import { FiDownload, FiFileText, FiX } from "react-icons/fi";

const ShowAttachments = ({ txn }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = async (fileUrl, fileName) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="text-pink-600 font-medium hover:underline hover:text-pink-700 transition"
      >
        View Attachments
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/70 rounded-xl border border-pink-800 shadow-lg p-5 w-[90%] max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-pink-600 transition"
            >
              <FiX size={22} />
            </button>

            {/* Modal Title */}
            <h2 className="text-lg font-semibold text-black mb-4 text-center">
              Attachments
            </h2>

            {/* Attachments Grid */}
            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
              {txn.files.map((file) => {
                const fileUrl =
                  `https://deno-88tn.onrender.com/${file.filePath.replace(
                    /\\/g,
                    "/"
                  )}` ||
                  `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}`;
                const isImage = file.fileType.startsWith("image/");

                return (
                  <div
                    key={file.id}
                    className="border rounded-lg p-2 bg-gray-50 flex flex-col items-center justify-center hover:shadow-md transition"
                  >
                    <div
                      className="cursor-pointer w-20 h-20 flex items-center justify-center bg-white border rounded-lg overflow-hidden"
                      onClick={() => handleDownload(fileUrl, file.fileName)}
                    >
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiFileText className="w-8 h-8 text-gray-700" />
                      )}
                    </div>
                    <p className="text-xs mt-2 text-center break-all text-gray-600">
                      {file.fileName}
                    </p>
                    <button
                      onClick={() => handleDownload(fileUrl, file.fileName)}
                      className="mt-1 text-pink-600 hover:text-pink-700 flex items-center gap-1 text-xs"
                    >
                      <FiDownload size={14} /> Download
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAttachments;
