"use client";

import React, { useEffect, useState } from "react";
import Header from "./layouts/Header";
import Cards from "./Cards";
import { useAuth } from "@/context/AuthContext";

import Transactions from "./Transactions";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "@/redux/features/transaction/transaactionSlice";

const Home = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(fetchTransactions()); // ✅ Fetch transactions
  }, [dispatch]);

  // ✅ Show welcome message for 3 seconds on page load
  useEffect(() => {
    if (user && user.name) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(transactions, "from home");
  return (
    <div>
      <Header />
      {showWelcome && (
        <div className="bg-green-50 border border-green-300 text-green-700 text-center py-4 px-6 font-semibold text-lg shadow-md transition-all duration-500">
          🎉 Welcome back, {user?.name}! Glad to see you again.
        </div>
      )}

      <Cards />
      <Transactions />
    </div>
  );
};

export default Home;
