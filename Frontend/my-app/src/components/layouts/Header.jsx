"use client";

import React, { useState } from "react";
import Image from "next/image";
import TtLogo from "@/app/public/wallet-svgrepo-com.svg";
import userIcon from "@/app/public/user-svgrepo-com.svg";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Data = [
  { key: "Dashboard", link: "/" },
  { key: "Add Account", link: "/addaccount" },
  { key: "Transactions", link: "/transactions" },
  { key: "History", link: "/history" },
  { key: "Upload Transaction", link: "/uploadtransaction" },
  { key: "User", link: "/user" }, // ✅ Added User to menu
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-4 py-2 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <Image src={TtLogo} alt="XloritLogo" className="w-8" />
            <p className="font-bold text-lg group-hover:text-blue-700 transition">
              Xlorit - TT
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {Data.map((e, i) => (
            <Link key={i} href={e.link}>
              <p
                className="px-3 py-1.5 rounded-xl bg-white shadow-sm 
                border border-transparent hover:border-blue-300 
                hover:text-blue-700 font-medium transition"
              >
                {e.key}
              </p>
            </Link>
          ))}
        </nav>

        {/* User Icon */}
        <Link href="/user" className="hidden md:block">
          <div
            className="p-2 rounded-full bg-white shadow-sm 
            border border-transparent hover:border-blue-300 
            hover:text-blue-700 transition cursor-pointer"
          >
            <Image src={userIcon} alt="User icon" className="w-5" />
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-700"
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
                  className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 
                  hover:text-blue-700 font-medium transition"
                >
                  {e.key}
                </p>
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
