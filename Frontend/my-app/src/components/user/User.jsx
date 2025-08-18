"use client"
import { useAuth } from "@/context/AuthContext"
import React from "react"

const User = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-gray-500">Fetching your profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        👤 User Profile
      </h1>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-medium text-gray-600">Name</h4>
          <p className="text-gray-900">{user.name || "N/A"}</p>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-medium text-gray-600">Email</h4>
          <p className="text-gray-900">{user.email || "N/A"}</p>
        </div>

        {/* Optional Role */}
        {user.role && (
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-medium text-gray-600">Role</h4>
            <p className="text-gray-900 capitalize">{user.role}</p>
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
      >
        Logout
      </button>
    </div>
  )
}

export default User
