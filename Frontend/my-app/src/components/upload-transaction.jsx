"use client";

import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function UploadTransaction({ setShow }) {
  const auth = useAuth();
  const userId = auth?.user?.id;

  const [file, setFile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/getAccountByuser");
        setAccounts(res.data.data || []);
      } catch (err) {
        alert("⚠️ Failed to load accounts");
      }
    };

    if (userId) fetchAccounts();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("⚠️ Please select a file");
    if (!selectedAccountId) return alert("⚠️ Please select an account");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("accountId", selectedAccountId);

    try {
      await api.post("/transaction/import/transactions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Transactions uploaded successfully");
      setFile(null);
      setSelectedAccountId("");
      setShow(false);
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("❌ Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-pink-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block font-semibold mb-2 text-black flex items-center gap-2">
              <FaCloudUploadAlt className="text-pink-600 text-xl" />
              Transaction File
              <span className="text-sm text-gray-500 ml-1">(.csv or .xls)</span>
            </label>
            <input
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-pink-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition bg-white/70"
            />
          </div>

          {/* Account Dropdown */}
          <div>
            <label className="block font-semibold mb-2 text-black">
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full border border-pink-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition bg-white/70"
            >
              <option value="">-- Select Account --</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - {acc.accountNo}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="px-5 py-2 rounded-lg bg-black/80 hover:bg-black text-white font-medium shadow-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// "use client";

// import React, { useState, useEffect } from "react";
// // import api from "@/lib/axios";
// import api from "../lib/axios"

// import { useAuth } from "../context/AuthContext";
// import { FaCloudUploadAlt } from "react-icons/fa";

// export default function UploadTransaction({ setShow }) {
//   const auth = useAuth();
//   const userId = auth?.user?.id;

//   const [file, setFile] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccountId, setSelectedAccountId] = useState("");

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const res = await api.get("/getAccountByuser");
//         setAccounts(res.data.data || []);
//       } catch (err) {
//         alert("⚠️ Failed to load accounts");
//       }
//     };

//     if (userId) fetchAccounts();
//   }, [userId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) return alert("⚠️ Please select a file");
//     if (!selectedAccountId) return alert("⚠️ Please select an account");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);
//     formData.append("accountId", selectedAccountId);

//     try {
//       await api.post("/transaction/import/transactions", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("✅ Transactions uploaded successfully");
//       setFile(null);
//       setSelectedAccountId("");
//       setShow(false);
//     } catch (err) {
//       console.error(err?.response?.data || err);
//       alert("❌ Upload failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto  ">
//       <div className="bg-white shadow-lg rounded-2xl p-8">
//         {/* <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//           <FaCloudUploadAlt className="inline-block mr-2 text-blue-600 text-3xl" />
//           Upload Transactions
//         </h2> */}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* File Input */}
//           <div>
//             <label className="block font-medium mb-2 text-gray-700">
//               Transaction File
//               <span className="text-sm text-gray-500 ml-1">
//                 (.csv or .xls)
//               </span>
//             </label>
//             <input
//               type="file"
//               accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//             />
//           </div>

//           {/* Account Dropdown */}
//           <div>
//             <label className="block font-medium mb-2 text-gray-700">
//               Select Account
//             </label>
//             <select
//               value={selectedAccountId}
//               onChange={(e) => setSelectedAccountId(e.target.value)}
//               className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//             >
//               <option value="">-- Select Account --</option>
//               {accounts.map((acc) => (
//                 <option key={acc.id} value={acc.id}>
//                   {acc.name} - {acc.accountNo}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Buttons */}
//           <div className="flex items-center justify-between">
//             <button
//               type="button"
//               onClick={() => setShow(false)}
//               className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
//             >
//               Upload
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
