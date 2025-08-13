import Cards from '@/components/Cards'

import History from '@/components/History'
import Transactions from '@/components/Transactions'
import UploadBank from '@/components/upload-bank'
import UploadTransaction from '@/components/upload-transaction'
import React from 'react'

const page = () => {
  return (
    <div>
      <Cards />
      <UploadBank />
      <UploadTransaction />
      <Transactions />
      <History />
    </div>
  )
}

export default page
