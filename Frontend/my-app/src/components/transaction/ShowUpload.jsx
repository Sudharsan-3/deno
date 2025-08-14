"use client"
import api from '@/lib/axios';
import React, { useState } from 'react'

const ShowUpload = ({  setUploadTxnId,uploadTxnId,fetchTransactions,setShowUploadModal}) => {
    const [uploadFile, setUploadFile] = useState(null);
    console.log(uploadFile,uploadTxnId ,"fom ShowUpload")

     // Updated handleUploadAttachment function
  const handleUploadAttachment = async () => {
    if (!uploadTxnId || !uploadFile?.length) {
      alert("Please select one or more files.");
      return;
    }

    const formData = new FormData();
    formData.append("transactionId", uploadTxnId);
    Array.from(uploadFile).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post("/transaction/upload/attachments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully!");
      setUploadFile(null);
      setUploadTxnId(null);
      setShowUploadModal(false);
      fetchTransactions();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error uploading files.");
    }
  };

  return (
    <div>
         <div className="fixed inset-0 bg-transparent bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-lg"
              onClick={() => {
                setShowUploadModal(false);
                setUploadFile(null);
              }}
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold mb-4">Upload Attachments</h3>

            <label
              htmlFor="file-upload"
              className="block w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded cursor-pointer text-center text-gray-500 hover:bg-gray-100 transition"
            >
              {uploadFile?.length > 0
                ? `${uploadFile.length} file(s) selected`
                : "Click to select or drag files here"}
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={(e) => setUploadFile(e.target.files)}
                className="hidden"
              />
            </label>

            <button
              onClick={handleUploadAttachment}
              disabled={!uploadFile || uploadFile.length === 0}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </div>
      
    </div>
  )
}

export default ShowUpload
