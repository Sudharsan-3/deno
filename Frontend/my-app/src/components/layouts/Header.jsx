"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TtLogo from "@/app/public/wallet-svgrepo-com.svg";
import userIcon from "@/app/public/user-svgrepo-com.svg";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCreditCard } from "react-icons/fi";

const Data = [
  { key: "Dashboard", link: "/" },
  { key: "Add Account", link: "/addaccount" },
  { key: "Transactions", link: "/transactions" },
  { key: "History", link: "/history" },
  { key: "Upload Transaction", link: "/uploadtransaction" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to toggle background color
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/">
  <div className="flex items-center gap-2 cursor-pointer group">
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
      Xlorit - TT
    </p>
  </div>
</Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          {Data.map((e, i) => (
            <Link key={i} href={e.link}>
              <p
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  scrolled
                    ? "bg-pink-500 text-white  hover:bg-pink-600"
                    : "bg-white text-black hover:border hover:border-pink-400"
                }`}
              >
                {e.key}
              </p>
            </Link>
          ))}
        </nav>

        {/* User Icon for Desktop */}
        <Link href="/user" className="hidden md:block">
          <div
            className={`p-2 rounded-full transition ${
              scrolled
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-white hover:border hover:border-pink-400"
            }`}
          >
            <Image src={userIcon} alt="User icon" className="w-5" />
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 ${
            scrolled ? "text-white" : "text-gray-700"
          }`}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown with animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden flex flex-col gap-2 px-4 pb-3 bg-white border-t shadow-md"
          >
            {Data.map((e, i) => (
              <Link key={i} href={e.link} onClick={() => setMenuOpen(false)}>
                <p
                  className="px-3 py-2 rounded-lg bg-gray-50 border border-transparent hover:bg-pink-100 
                  hover:text-pink-600 font-medium transition"
                >
                  {e.key}
                </p>
              </Link>
            ))}
            {/* User link in mobile menu */}
            <Link href="/user" onClick={() => setMenuOpen(false)}>
              <p
                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-pink-100 
                hover:text-pink-600 font-medium transition"
              >
                User
              </p>
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
