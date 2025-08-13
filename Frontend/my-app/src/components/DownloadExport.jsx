"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import React from "react";

export default function DownloadExport({ filters }) {
  useAuth();

  const handleExport = async (type) => {
    try {
      const response = await api.post(
        `/transaction/export-zip?format=${type}`, // format is either csv or excel
        filters,
        { responseType: "blob" } // needed for file download
      );

      // Always download as ZIP
      const blob = new Blob([response.data], { type: "application/zip" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_with_attachments.zip`; // fixed ZIP filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export file. Please try again.");
    }
  };

  return (
    <div className="space-x-4 p-4">
      <button
        onClick={() => handleExport("csv")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Export CSV + Attachments (ZIP)
      </button>

      <button
        onClick={() => handleExport("excel")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Export Excel + Attachments (ZIP)
      </button>
    </div>
  );
}


// "use client";

// import { useAuth } from "@/context/AuthContext";
// import api from "@/lib/axios";
// import React from "react";

// export default function DownloadExport({ filters  }) {
//   useAuth();
  
//   const handleExport = async (type) => {
//     console.log(showAttachments,"from attachment download")
//     try {
//       const response = await api.post(
//         `/transaction/export/${type}`,
//         filters,
//         { responseType: "blob" } // blob for file download
//       );

//       const blob = new Blob([response.data], {
//         type: response.headers["content-type"],
//       });

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `transactions.${type === "csv" ? "csv" : "xlsx"}`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Failed to export file. Please try again.");
//     }
//   };

//   return (
//     <div className="space-x-4 p-4">
//       <button
//         onClick={() => handleExport("csv")}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Export CSV
//       </button>

//       <button
//         onClick={() => handleExport("excel")}
//         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//       >
//         Export Excel
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useAuth } from "@/context/AuthContext";
// import api from "@/lib/axios";
// import React from "react";

// export default function DownloadExport() {
//   useAuth(); // Keeps auth context initialized

//   const handleExport = async (type) => {
//     try {
//       const response = await api.get(`/transaction/export/${type}`, {
//         responseType: "blob", // Important for downloading files
//       });

//       const blob = new Blob([response.data], { type: response.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `transactions.${type === "csv" ? "csv" : "xlsx"}`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url); // Clean up
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Failed to export file. Please try again.");
//     }
//   };

//   return (
//     <div className="space-x-4 p-4">
//       <button
//         onClick={() => handleExport("csv")}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Export CSV
//       </button>

//       <button
//         onClick={() => handleExport("excel")}
//         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//       >
//         Export Excel
//       </button>
//     </div>
//   );
// }
