"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";

const AccountInfos = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = async () => {
      try {
        const res = await api.get("/userInfo");
        setUser(res.data || null);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    userInfo();
  }, []);

  const accountTransactionSummary = user?.data?.data?.accountTransactionSummary;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
    {/* Header */}
    <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">
      Dashboard Overview
    </h1>
  
    {/* Transaction Details Section */}
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        📊 Transaction Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[
          {
            label: "Total Accounts",
            value: user?.data?.data?._counts?.accounts || 0,
            color: "from-indigo-500 to-blue-500",
          },
          {
            label: "Total Transactions",
            value: user?.data?.data?._counts?.transactions || 0,
            color: "from-green-500 to-teal-500",
          },
          {
            label: "Transactions In Use",
            value: user?.data?.data?._counts?.transactionsInuse || 0,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Transactions Deleted",
            value: user?.data?.data?._counts?.transactionsDeleted || 0,
            color: "from-red-500 to-orange-500",
          },
          {
            label: "Total Snapshots",
            value: user?.data?.data?._counts?.snapshots || 0,
            color: "from-yellow-500 to-amber-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
          >
            <h4 className="text-lg font-medium text-white">{item.label}</h4>
            <p className="text-3xl font-extrabold mt-2 text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  
    {/* Account Summary Section */}
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        🏦 Registered Account Summary
      </h2>
      {accountTransactionSummary?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountTransactionSummary.map((account, index) => (
            <div
              key={index}
              className="border rounded-2xl bg-gray-50 p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {account?.accountName}
              </h3>
              <p className="text-gray-700 mt-3">
                Transactions:{" "}
                <span className="font-bold text-gray-900">
                  {account?.transactionCount}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center">
          No account summary found.
        </p>
      )}
    </section>
  </div>
  
  );
};

export default AccountInfos;
