import api from "@/lib/axios";

// PUBLIC APIs
export const loginAPI = async (credentials) => {
  const res = await api.post("/login", credentials);
  console.log(res,"from the   login api")
  return res;
};

export const registerAPI = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};


export const getAllTransactions = async() =>{
  const  res = await api.get("/transaction/all")
  return res.data
}