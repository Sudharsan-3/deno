import api from "@/lib/axios"

export const uploadAccountDetails = async(credentials)=>{
    const data  = await api.post("/account",credentials)
    return data
}
