import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://deno-88tn.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const rawData = localStorage.getItem("authData");
    try {
      const parsedData = JSON.parse(rawData);
      const token = parsedData?.token || parsedData?.data?.token;

      if (token) {
        const decoded = jwtDecode(token); // decode JWT
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expired. Redirecting to login...");
          localStorage.removeItem("authData");
          window.location.href = "/login";
          return Promise.reject("Token expired");
        }

        config.headers.Authorization = token;
      }
    } catch (e) {
      console.warn("Invalid authData format in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      localStorage.removeItem("authData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
// });

// api.interceptors.request.use(
//   (config) => {
//     const rawData = localStorage.getItem("authData");
//     try {
//       const parsedData = JSON.parse(rawData);
//       const token = parsedData?.token || parsedData?.data?.token;
//       if (token) {
//         config.headers.Authorization =token;
//       }
//     } catch (e) {
//       console.warn("Invalid authData format in localStorage");
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized. Redirecting to login...");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;