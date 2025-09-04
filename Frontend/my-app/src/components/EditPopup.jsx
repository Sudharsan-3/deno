"use client";
import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import { FiX } from "react-icons/fi";

const fields = [
  { key: "transactionDate", label: "Transaction Date", type: "date" },
  { key: "valueDate", label: "Value Date", type: "date" },
  { key: "description", label: "Description", type: "text" },
  { key: "amount", label: "Amount", type: "number" },
  { key: "amountType", label: "Amount Type", type: "dropdown", options: ["CR", "DR"] },
  { key: "balance", label: "Balance", type: "number" },
  { key: "balanceType", label: "Balance Type", type: "dropdown", options: ["CR", "DR"] },
  { key: "chequeOrRef", label: "Cheque or Reference", type: "text" },
  { key: "invoice", label: "Invoice", type: "text" }, 
  { key: "changeReason", label: "Change Reason", type: "text" },
];

export default function EditPopup({ isOpen, onClose, data, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (data) {
      const formattedData = {
        transactionDate: data.transactionDate?.split("T")[0] || "",
        valueDate: data.valueDate?.split("T")[0] || "",
        description: data.description || "",
        amount: data.amount || "",
        amountType: data.amountType || "",
        balance: data.balance || "",
        balanceType: data.balanceType || "",
        chequeOrRef: data.chequeOrRef || "",
        invoice: data.invoice || "",
        changeReason: data.changeReason || "",
      };
      setFormData(formattedData);
      setOriginalData(formattedData);
    }
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString();
  };

  const handleSave = async () => {
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      onClose();
      return;
    }

    if (changedFields.transactionDate) {
      changedFields.transactionDate = formatDateTime(changedFields.transactionDate);
    }
    if (changedFields.valueDate) {
      changedFields.valueDate = formatDateTime(changedFields.valueDate);
    }
    if (changedFields.amount) changedFields.amount = Number(changedFields.amount);
    if (changedFields.balance) changedFields.balance = Number(changedFields.balance);

    try {
      await api.put(`/transaction/updateTransaction/${data.id}`, changedFields);
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error.response?.data || error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[95%] max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-600 transition"
        >
          <FiX size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-black mb-5 text-center">
          ✏️ Edit Transaction
        </h2>

        {/* Form */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((f) => (
            <div key={f.key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {f.label}
              </label>

              {f.type === "dropdown" ? (
                <select
                  value={formData[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="border border-pink-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                >
                  <option value="">Select {f.label}</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={formData[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="border border-pink-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition font-medium shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import React, { useState, useEffect } from "react";
// // import api from "@/lib/axios";
// import api from "../lib/axios"

// const fields = [
//   { key: "transactionDate", label: "Transaction Date", type: "date" },
//   { key: "valueDate", label: "Value Date", type: "date" },
//   { key: "description", label: "Description", type: "text" },
//   { key: "amount", label: "Amount", type: "number" },
//   { key: "amountType", label: "Amount Type", type: "dropdown", options: ["CR", "DR"] },
//   { key: "balance", label: "Balance", type: "number" },
//   { key: "balanceType", label: "Balance Type", type: "dropdown", options: ["CR", "DR"] },
//   { key: "chequeOrRef", label: "Cheque or Reference", type: "text" },
//   { key: "invoice", label: "Invoice", type: "text" }, // NEW FIELD
//   { key: "changeReason", label: "Change Reason", type: "text" },
// ];

// export default function EditPopup({ isOpen, onClose, data, onUpdated }) {
//   const [formData, setFormData] = useState({});
//   const [originalData, setOriginalData] = useState({});

//   useEffect(() => {
//     if (data) {
//       const formattedData = {
//         transactionDate: data.transactionDate?.split("T")[0] || "",
//         valueDate: data.valueDate?.split("T")[0] || "",
//         description: data.description || "",
//         amount: data.amount || "",
//         amountType: data.amountType || "",
//         balance: data.balance || "",
//         balanceType: data.balanceType || "",
//         chequeOrRef: data.chequeOrRef || "",
//         invoice: data.invoice || "", // NEW FIELD
//         changeReason: data.changeReason || "",
//       };
//       setFormData(formattedData);
//       setOriginalData(formattedData);
//     }
//   }, [data]);

//   if (!isOpen) return null;

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return null;
//     const date = new Date(dateStr);
//     return date.toISOString();
//   };

//   const handleSave = async () => {
//     const changedFields = {};
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== originalData[key]) {
//         changedFields[key] = formData[key];
//       }
//     });

//     if (Object.keys(changedFields).length === 0) {
//       console.log("No changes detected, skipping update.");
//       onClose();
//       return;
//     }

//     if (changedFields.transactionDate) {
//       changedFields.transactionDate = formatDateTime(changedFields.transactionDate);
//     }
//     if (changedFields.valueDate) {
//       changedFields.valueDate = formatDateTime(changedFields.valueDate);
//     }

//     if (changedFields.amount) changedFields.amount = Number(changedFields.amount);
//     if (changedFields.balance) changedFields.balance = Number(changedFields.balance);

//     try {
//       await api.put(`/transaction/updateTransaction/${data.id}`, changedFields);
//       if (onUpdated) onUpdated();
//       onClose();
//     } catch (error) {
//       console.error("Error updating transaction:", error.response?.data || error);
//     }
//   };

//   return (
//     <div className="fixed bg-black/30 backdrop-blur-sm inset-0 flex items-center justify-center z-50">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-transparent bg-opacity-40"
//         onClick={onClose}
//       ></div>

//       {/* Popup */}
//       <div className="relative bg-white rounded-lg shadow-lg p-6 w-96 z-10">
//         <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>

//         <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//           {fields.map((f) => (
//             <div key={f.key} className="flex flex-col">
//               <label className="text-sm font-semibold mb-1">{f.label}</label>

//               {f.type === "dropdown" ? (
//                 <select
//                   value={formData[f.key] || ""}
//                   onChange={(e) => handleChange(f.key, e.target.value)}
//                   className="border border-gray-300 rounded px-2 py-1"
//                 >
//                   <option value="">Select {f.label}</option>
//                   {f.options.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={f.type}
//                   value={formData[f.key] || ""}
//                   onChange={(e) => handleChange(f.key, e.target.value)}
//                   className="border border-gray-300 rounded px-2 py-1"
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             onClick={onClose}
//             className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
