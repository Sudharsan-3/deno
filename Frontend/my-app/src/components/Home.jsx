"use client"

import React, { useEffect, useState } from 'react'
import Header from './layouts/Header'
import Cards from './Cards'

import Transactions from './Transactions'
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from '@/redux/features/transaction/transaactionSlice'

// import Upload from './transaction/Upload'


const Home = () => {
 
  

  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchTransactions()); // ✅ dispatch the thunk
  }, [dispatch]);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(transactions, "from home")
  return (
    <div>
      <Header />
      <Cards />

      {/* <Upload /> */}

      <Transactions />
    </div>
  )
}

export default Home
