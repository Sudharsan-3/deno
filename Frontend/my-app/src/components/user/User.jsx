"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import AccountInfos from "../accounts/AccountInfos";
import ViewAccounts from "../accounts/ViewAccounts";
import { FaUser, FaEnvelope, FaUserShield } from "react-icons/fa";

const User = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome message for 5 sec when user logs in
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="animate-pulse text-gray-500 text-lg">
          Fetching your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg text-white py-6 px-8 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-extrabold">Welcome, {user.name || "User"} 👋</h1>
        <button
          onClick={logout}
          className="mt-4 md:mt-0 px-6 py-2 bg-black hover:bg-gray-900 text-white rounded-xl shadow-md transition"
        >
          Logout
        </button>
      </div> */}

      {/* Welcome Banner (Only for 5 Seconds) */}
      {showWelcome && (
        <div className="bg-green-50 border border-green-300 text-green-700 text-center py-4 px-6 font-semibold text-lg shadow-md">
          🎉 Welcome back, {user.name}! Glad to see you again.
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8 hover:shadow-2xl transition">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg hover:scale-105 transition-transform">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.role && (
              <p className="mt-1 text-sm text-pink-600 font-semibold capitalize">
                {user.role}
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <FaUser className="text-pink-500 text-xl" />
              <div>
                <h4 className="font-semibold">Name:</h4>
                <p>{user.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-pink-500 text-xl" />
              <div>
                <h4 className="font-semibold">Email:</h4>
                <p>{user.email || "N/A"}</p>
              </div>
            </div>
            {user.role && (
              <div className="flex items-center gap-3">
                <FaUserShield className="text-pink-500 text-xl" />
                <div>
                  <h4 className="font-semibold">Role:</h4>
                  <p className="capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accounts Section */}
        {/* <div>
          <ViewAccounts />
        </div> */}

        {/* Account Infos Section */}
        <AccountInfos />
      </div>
    </div>
  );
};

export default User;


// "use client";
// import { useAuth } from "@/context/AuthContext";
// import React from "react";
// import AccountInfos from "../accounts/AccountInfos";
// import ViewAccounts from "../accounts/ViewAccounts";

// const User = () => {
//   const { user, logout } = useAuth();

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="animate-pulse text-gray-500 text-lg">Fetching your profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg text-white py-6 px-8 flex flex-col md:flex-row justify-between items-center">
//         <h1 className="text-3xl font-extrabold">Welcome, {user.name || "User"} 👋</h1>
//         <button
//           onClick={logout}
//           className="mt-4 md:mt-0 px-6 py-2 bg-black hover:bg-gray-900 text-white rounded-xl shadow-md transition"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8">
//           {/* Avatar */}
//           <div className="flex flex-col items-center md:items-start">
//             <div className="w-24 h-24 bg-pink-500 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
//               {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//             </div>
//             <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
//             <p className="text-gray-500">{user.email}</p>
//             {user.role && (
//               <p className="mt-1 text-sm text-pink-600 font-semibold capitalize">
//                 {user.role}
//               </p>
//             )}
//           </div>

//           {/* Info Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 w-full md:w-auto">
//             <div>
//               <h4 className="font-semibold">Name:</h4>
//               <p>{user.name || "N/A"}</p>
//             </div>
//             <div>
//               <h4 className="font-semibold">Email:</h4>
//               <p>{user.email || "N/A"}</p>
//             </div>
//             {user.role && (
//               <div>
//                 <h4 className="font-semibold">Role:</h4>
//                 <p className="capitalize">{user.role}</p>
//               </div>
//             )}
//           </div>
//         </div>
//  {/* Accounts Section */}
//         <div>
         
//           <ViewAccounts />
//         </div>
//         {/* Account Infos Section */}
//         <AccountInfos />

       
//       </div>
//     </div>
//   );
// };

// export default User;
