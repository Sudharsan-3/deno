"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import AccountInfos from "../accounts/AccountInfos";
import { FaUser, FaEnvelope, FaUserShield } from "react-icons/fa";

const User = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

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
    <div className="min-h-screen bg-transparent text-gray-900">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-pink-50 border border-pink-200 text-pink-700 text-center py-4 px-6 font-semibold text-lg shadow-md">
          🎉 Welcome back, {user.name}! Glad to see you again.
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-10 hover:shadow-2xl transition">
          {/* Avatar */}
          <div className="flex flex-col items-center">
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

          {/* Info Section */}
         
{/* Account Infos Section */}
        <AccountInfos />
          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-6 py-2 mt-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default User;

