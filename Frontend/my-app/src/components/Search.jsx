'use client'

import api from '@/lib/axios'
import React, { useState } from 'react'

const Search = ({data}) => {

    const [userSearch,setUserSearch] = useState("")



    const handelClick = async()=>{
        try {
             const res = await api.post("/transaction/search",{userSearch:userSearch})
             if(res) {
                console.log(res.data.data)
        data(res.data.data.filtered)
             }
        
        } catch (error) {
            console.log(error)
            
        }
       
        setUserSearch("")
    }

  return (
    <div className='flex gap-4' >
        <input
         onChange={(e)=>(setUserSearch( e.target.value))} 
         value={userSearch}
        className='border-1 border-b-black' type="search" />

        <button onClick={handelClick}>search</button>
      
    </div>
  )
}

export default Search
