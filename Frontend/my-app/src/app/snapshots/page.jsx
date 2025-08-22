import Header from '@/components/layouts/Header'
import { TransactionSnapshot } from '@/components/transaction/TransactionSnapshot'
import React from 'react'

const page = () => {
  return (
    <div>
        <Header />
        <TransactionSnapshot />
      
    </div>
  )
}

export default page
