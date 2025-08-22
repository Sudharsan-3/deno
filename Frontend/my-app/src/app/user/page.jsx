import React from 'react'
import Header from '@/components/layouts/Header'
import User from '@/components/user/User'
import AccountInfos from '@/components/accounts/AccountInfos'
import ViewAccounts from '@/components/accounts/ViewAccounts'

const page = () => {
  return (
    <div>
      <Header />
      <User />
      <AccountInfos />
      <ViewAccounts />
    </div>
  )
}

export default page
