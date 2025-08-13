import React from 'react'
const types=["transaction Date",
    "Value Date",
    "Description",
    "Amount",
    "Amount",
    "Amount Type",
    "Balance",
    "Balance Type",
    "Cheque or reference",
    "Chnage reason",

]

const EditeTransaction = () => {
  return (
    <div>
        <p>Edit transaction</p>
       
            {types.map((e,i)=>{
                return(
                     <div key={i}>
                     <label htmlFor="">{e}</label>
                     <input className='border-black border-1' type="text" />
                     </div>
                )
            })}
           
            
        
      
    </div>
  )
}

export default EditeTransaction
