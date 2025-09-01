import api from "@/lib/axios";

export const getUser = async()=>{
    const res = await api.get("/userInfo")
    return res.data;
  }