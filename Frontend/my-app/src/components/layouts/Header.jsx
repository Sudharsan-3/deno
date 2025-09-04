"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiCreditCard } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import userIcon from "../../app/public/user-svgrepo-com.svg";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { key: "Dashboard", link: "/" },
  { key: "Account", link: "/accounts" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 px-3 backdrop-blur-md bg-black/95 shadow-md transition-all">
      <div className="flex justify-between items-center py-3 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <FiCreditCard className="text-2xl text-pink-500 group-hover:text-pink-400 transition" />
          <p className="font-bold text-lg text-white group-hover:text-pink-400 transition">
            Xlorit - Ti
          </p>
        </Link>

        <div className="flex gap-6 items-center">
          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-4 items-center">
            {navItems.map((item) => (
              <Link key={item.key} href={item.link}>
                <p className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 transition-all shadow-md hover:shadow-lg">
                  {item.key}
                </p>
              </Link>
            ))}
          </nav>

          {/* User Icon (Desktop) */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="hidden md:block p-2 rounded-full bg-pink-600 hover:bg-pink-500 transition shadow-md hover:shadow-lg"
          >
            <img src={userIcon.src} alt="User icon" className="w-6" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden flex flex-col gap-2 px-4 pb-3 bg-black/95 border-t border-gray-700 shadow-lg"
          >
            {navItems.map((item) => (
              <Link key={item.key} href={item.link} onClick={() => setMenuOpen(false)}>
                <p className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-pink-600 font-medium transition">
                  {item.key}
                </p>
              </Link>
            ))}

            {/* User link in mobile menu */}
            <button
              onClick={() => {
                setMenuOpen(false);
                setUserMenuOpen(true);
              }}
              className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-pink-600 font-medium transition text-left"
            >
              User
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* User Menu Popup */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-4 w-64 bg-black/95 backdrop-blur-md shadow-lg rounded-xl p-4 z-50 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg text-white">Profile</h3>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href={"/user"}>
                <button className="text-left px-3 py-2 rounded-md text-white hover:bg-gray-800 transition">
                  Settings
                </button>
              </Link>
              <button
                onClick={logout}
                className="text-left px-3 py-2 rounded-md text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;


