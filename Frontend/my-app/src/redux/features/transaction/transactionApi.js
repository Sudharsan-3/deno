import api from "@/lib/axios"


export const getAllTransactions = async() =>{
    const  res = await api.get("/transaction/all")
    return res.data
  }
