"use client";

// import api from "@/lib/axios";
import api from "../../lib/axios"
import React, { useEffect, useState } from "react";
import { FaWallet, FaExchangeAlt, FaClipboardList, FaTrashAlt, FaHistory } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "@/redux/features/userData/userInFoSlice";

const AccountInfos = () => {
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.userInfo);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  if (loading)  <p>Loading...</p>;
  if (error)  <p>Error: {error}</p>;
  console.log(userInfo, "from userinfo ui")
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

  const stats = [
    {
      label: "Total Accounts",
      value: user?.data?.data?._counts?.accounts || 0,
      icon: <FaWallet />,
      color: "from-pink-500 to-pink-400",
      subtext: "Accounts you own",
    },
    {
      label: "Total Transactions",
      value: user?.data?.data?._counts?.transactions || 0,
      icon: <FaExchangeAlt />,
      color: "from-black to-gray-800",
      subtext: "All transactions",
    },
    {
      label: "Transactions In Use",
      value: user?.data?.data?._counts?.transactionsInuse || 0,
      icon: <FaClipboardList />,
      color: "from-pink-400 to-pink-600",
      subtext: "Currently active",
    },
    {
      label: "Transactions Deleted",
      value: user?.data?.data?._counts?.transactionsDeleted || 0,
      icon: <FaTrashAlt />,
      color: "from-gray-700 to-black",
      subtext: "Removed transactions",
    },
    {
      label: "Total Snapshots",
      value: user?.data?.data?._counts?.snapshots || 0,
      icon: <FaHistory />,
      color: "from-pink-600 to-pink-700",
      subtext: "Change history",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <h1 className="text-4xl font-extrabold  mb-8 text-black">
        Account Overview
      </h1>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-200`}
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} text-white text-2xl mb-4`}
            >
              {item.icon}
            </div>

            {/* Label */}
            <h4 className="text-lg font-bold text-black">{item.label}</h4>

            {/* Value */}
            <p className="text-3xl font-extrabold mt-2 text-pink-600">
              {item.value}
            </p>

            {/* Subtext */}
            <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AccountInfos;
