"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSettings, FiLogOut } from "react-icons/fi";

const UserMenu = ({ isOpen, onClose, user }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50 flex flex-col p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-600"
              onClick={onClose}
            >
              <FiX size={24} />
            </button>

            {/* User Info */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Divider */}
            <div className="border-t mt-4 mb-4"></div>

            {/* Menu Options */}
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <FiSettings size={18} /> Settings
              </button>

              <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
