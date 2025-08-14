"use client"

import React from 'react'
import Image from 'next/image'
import XloritLogo from "@/app/public/Xlorit-icon.png"

const Data = [
    "Dashboard",
    "Accounts",
    "Add Accounts",
    "Transactions",
    "History",
    "User",
]

const Header = () => {
  return (
    <div className='flex '>
        <div className='flex'>
        <Image
        src={XloritLogo}
        alt='XloritLogo'
        className='w-20'
        />
        <p>
            Xlorit - TT
        </p>

        </div>
        <div>
            {
                Data.map((e,i)=>{
                    return(
                         <p key={i}>
                            {e}
            </p>
                    )
                })
            }
           
        </div>
      
    </div>
  )
}

export default Header
