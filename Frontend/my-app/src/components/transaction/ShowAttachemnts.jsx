"use client";
import api from "../../lib/axios";
import React, { useState } from "react";
import { FiFileText, FiX, FiTrash2, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";

const ShowAttachments = ({ txn }) => {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState(txn.files || []);
  console.log(txn?.files,"from showa")

  const handlePreview = (fileUrl, fileName) => {
    window.open(`/file-preview?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`, "_blank");
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
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 hover:shadow-sm cursor-pointer transition"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-5 w-[90%] max-w-md relative">
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
              {files.map((file) => {
                const fileUrl = `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}`;
                const isImage = file.fileType.startsWith("image/");

                return (
                  <div
                    key={file.id}
                    className="border rounded-lg p-2 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center hover:shadow-md transition"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-20 flex items-center justify-center bg-white border rounded-lg overflow-hidden"
                      onClick={() => handlePreview(fileUrl, file.fileName)}
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

                    {/* File Name */}
                    <p className="text-xs mt-2 text-center break-all text-gray-600">
                      {file.fileName}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(fileUrl, file.fileName)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
                      >
                        <FiEye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs"
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


// "use client";
// // import api from "@/lib/axios";
// import api from "../../lib/axios"
// import React, { useState } from "react";
// import { FiDownload, FiFileText, FiX, FiTrash2, FiPaperclip } from "react-icons/fi";
// // import { FiPaperclip } from "react-icons/fi";
// import { motion } from "framer-motion";

// const ShowAttachments = ({ txn }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [files, setFiles] = useState(txn.files || []);

//   const handleDownload = async (fileUrl, fileName) => {
//     const response = await fetch(fileUrl);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   };

//   const handlePreview = (fileUrl) => {
//     window.open(`/file-preview?url=${encodeURIComponent(fileUrl)}`, "_blank");
//   };
  
//   const handleDelete = async (fileId) => {
//     try {
//       const res = await api.delete("/transaction/deleteAttachment", {
//         data: { id: fileId },
//       });

//       if (res.status !== 200) {
//         throw new Error("Failed to delete file");
//       }

//       setFiles(files.filter((file) => file.id !== fileId));
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       alert("Failed to delete file");
//     }
//   };

//   return (
//     <div>
//       {/* Attachment Count (Trigger) */}
//       <div>
//   {files.length > 0 ? (
//     <motion.div
//     onClick={() => setShowModal(true)}
//     initial={{ scale: 0.9, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.3 }}
//     className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 hover:shadow-sm cursor-pointer transition"
//   >
//     <FiPaperclip size={14} className="text-pink-600" />
//     {files.length}
//   </motion.div>
//   ) : (
//     <span className="inline-flex items-center gap-1 text-gray-400 text-sm italic">
//       <FiPaperclip size={16} />
//       No attachments
//     </span>
//   )}
// </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-5 w-[90%] max-w-md relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-pink-600 transition"
//             >
//               <FiX size={22} />
//             </button>

//             {/* Modal Title */}
//             <h2 className="text-lg font-semibold text-black mb-4 text-center">
//               Attachments
//             </h2>

//             {/* Attachments Grid */}
//             <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
//               {files.map((file) => {
//                 const fileUrl =
//                   `https://deno-88tn.onrender.com/${file.filePath.replace(
//                     /\\/g,
//                     "/"
//                   )}` ||
//                   `http://localhost:5000/${file.filePath.replace(/\\/g, "/")}`;
//                 const isImage = file.fileType.startsWith("image/");

//                 return (
//                   <div
//                     key={file.id}
//                     className="border rounded-lg p-2 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center hover:shadow-md transition"
//                   >
//                     <div
//                       className="cursor-pointer w-20 h-20 flex items-center justify-center bg-white border rounded-lg overflow-hidden"
//                       onClick={() => handleDownload(fileUrl, file.fileName)}
//                     >
//                       {isImage ? (
//                         <img
//                           src={fileUrl}
//                           alt={file.fileName}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <FiFileText className="w-8 h-8 text-gray-700" />
//                       )}
//                     </div>
//                     <p className="text-xs mt-2 text-center break-all text-gray-600">
//                       {file.fileName}
//                     </p>
//                     <div className="mt-1 flex items-center gap-2">
//                       <button
//                         onClick={() =>
//                           handleDownload(fileUrl, file.fileName)
//                         }
//                         className="text-pink-600 hover:text-pink-700 flex items-center gap-1 text-xs"
//                       >
//                         <FiDownload size={14} /> Download
//                       </button>
//                       <button
//                         onClick={() => handleDelete(file.id)}
//                         className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs"
//                       >
//                         <FiTrash2 size={14} /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowAttachments;
