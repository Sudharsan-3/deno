"use client";
import api from "../../lib/axios";
import React, { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

const ShowUpload = ({
  setUploadTxnId,
  uploadTxnId,
  fetchTransactions,
  setShowUploadModal,
}) => {
  const [uploadFile, setUploadFile] = useState(null);

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowUploadModal(false);
            setUploadFile(null);
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-black transition"
        >
          <FiX size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-black mb-5 text-center">
          Upload Attachments
        </h2>

        {/* File Input */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-pink-400 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100 transition"
        >
          <FiUploadCloud className="text-pink-500 mb-2" size={36} />
          <span className="text-gray-700 text-sm">
            {uploadFile?.length > 0
              ? `${uploadFile.length} file(s) selected`
              : "Click to select or drag files here"}
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => setUploadFile(e.target.files)}
            className="hidden"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUploadAttachment}
          disabled={!uploadFile || uploadFile.length === 0}
          className="mt-6 w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiUploadCloud size={18} />
          Upload
        </button>
      </div>
    </div>
  );
};

export default ShowUpload;


// "use client"
// // import api from '@/lib/axios';
// import api from "../../lib/axios"
// import React, { useState } from 'react'

// const ShowUpload = ({  setUploadTxnId,uploadTxnId,fetchTransactions,setShowUploadModal}) => {
//     const [uploadFile, setUploadFile] = useState(null);
//     console.log(uploadFile,uploadTxnId ,"fom ShowUpload")

//      // Updated handleUploadAttachment function
//   const handleUploadAttachment = async () => {
//     if (!uploadTxnId || !uploadFile?.length) {
//       alert("Please select one or more files.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("transactionId", uploadTxnId);
//     Array.from(uploadFile).forEach((file) => {
//       formData.append("files", file);
//     });

//     try {
//       await api.post("/transaction/upload/attachments", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Files uploaded successfully!");
//       setUploadFile(null);
//       setUploadTxnId(null);
//       setShowUploadModal(false);
//       fetchTransactions();
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Error uploading files.");
//     }
//   };

//   return (
//     <div>
//          <div className="fixed inset-0  bg-black/30 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 text-lg"
//               onClick={() => {
//                 setShowUploadModal(false);
//                 setUploadFile(null);
//               }}
//             >
//               ✖
//             </button>

//             <h3 className="text-lg font-semibold mb-4">Upload Attachments</h3>

//             <label
//               htmlFor="file-upload"
//               className="block w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded cursor-pointer text-center text-gray-500 hover:bg-gray-100 transition"
//             >
//               {uploadFile?.length > 0
//                 ? `${uploadFile.length} file(s) selected`
//                 : "Click to select or drag files here"}
//               <input
//                 id="file-upload"
//                 type="file"
//                 multiple
//                 onChange={(e) => setUploadFile(e.target.files)}
//                 className="hidden"
//               />
//             </label>

//             <button
//               onClick={handleUploadAttachment}
//               disabled={!uploadFile || uploadFile.length === 0}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               Upload
//             </button>
//           </div>
//         </div>
      
//     </div>
//   )
// }

// export default ShowUpload
