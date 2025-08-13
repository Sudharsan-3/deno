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
