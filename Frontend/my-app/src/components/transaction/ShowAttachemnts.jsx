"use client";
import api from "../../lib/axios";
import React, { useState } from "react";
import { FiFileText, FiX, FiTrash2, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";

const ShowAttachments = ({ txn }) => {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState(txn.files || []);
  console.log(txn?.files, "from showa");

  const handlePreview = (fileUrl, fileName) => {
    window.open(
      `/file-preview?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`,
      "_blank"
    );
  };

  const handleDelete = async (fileId) => {
    try {
      const res = await api.delete("/transaction/deleteAttachment", {
        data: { id: fileId },
      });

      if (res.status !== 200) {
        throw new Error("Failed to delete file");
      }

      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  return (
    <div>
      {/* Attachment Count (Trigger) */}
      <div>
        {files.length > 0 ? (
          <motion.div
            onClick={() => setShowModal(true)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 hover:shadow cursor-pointer transition"
          >
            📎 {files.length}
          </motion.div>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-400 text-sm italic">
            📎 No attachments
          </span>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
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
            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-1">
              {files.map((file) => {
                const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}`;
                const isImage = file.fileType.startsWith("image/");

                return (
                  <div
                    key={file.id}
                    className="border border-pink-200 rounded-lg p-3 bg-pink-50 hover:bg-pink-100 flex flex-col items-center justify-center transition"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-20 flex items-center justify-center bg-white border border-pink-200 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handlePreview(fileUrl, file.fileName)}
                    >
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiFileText className="w-8 h-8 text-pink-600" />
                      )}
                    </div>

                    {/* File Name */}
                    <p className="text-xs mt-2 text-center break-all text-gray-700 font-medium">
                      {file.fileName}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => handlePreview(fileUrl, file.fileName)}
                        className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1 font-medium"
                      >
                        <FiEye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
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


