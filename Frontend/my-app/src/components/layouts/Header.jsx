"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiCreditCard } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import userIcon from "../../app/public/user-svgrepo-com.svg";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { key: "Dashboard", link: "/" },
  { key: "Account", link: "/accounts" },
  // { key: "Transactions", link: "/transactions" },
  // { key: "History", link: "/history" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

 

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

   const { user, logout } = useAuth();
  

  return (
    <header
      className={`sticky top-0 z-50 transition-all px-3 duration-300 ${
        scrolled ? "bg-black shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center py-3 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <FiCreditCard
            className={`text-2xl transition-colors duration-300 ${
              scrolled ? "text-white" : "text-black"
            } group-hover:text-pink-500`}
          />
          <p
            className={`font-bold text-lg transition ${
              scrolled ? "text-white" : "text-black"
            } group-hover:text-pink-500`}
          >
            Xlorit - Ti
          </p>
        </Link>

        <div className="flex gap-6 items-center">
          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <Link key={item.key} href={item.link}>
                <p
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    scrolled
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "bg-white text-black hover:border hover:border-pink-400"
                  }`}
                >
                  {item.key}
                </p>
              </Link>
            ))}
          </nav>

          {/* User Icon for Desktop */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`hidden md:block p-2 rounded-full transition ${
              scrolled
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-white hover:border hover:border-pink-400"
            }`}
          >
            <img src={userIcon.src} alt="User icon" className="w-5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 ${scrolled ? "text-white" : "text-gray-700"}`}
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
            className="md:hidden flex flex-col gap-2 px-4 pb-3 bg-white border-t shadow-md"
          >
            {navItems.map((item) => (
              <Link key={item.key} href={item.link} onClick={() => setMenuOpen(false)}>
                <p className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-pink-100 hover:text-pink-600 font-medium transition">
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
              className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-pink-100 hover:text-pink-600 font-medium transition text-left"
            >
              User
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ✅ User Menu Popup */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-4 w-64 bg-white shadow-lg rounded-xl p-4 z-50 border"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Profile</h3>
              <button onClick={() => setUserMenuOpen(false)} className="text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href={"/user"}>
                            <button className="text-left px-3 py-2 rounded-md hover:bg-gray-100">Settings</button>

              </Link>
              <button
                onClick={logout}
                className="text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-100"
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


