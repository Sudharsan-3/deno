// context/AuthContext.js
"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    const authData = localStorage.getItem("authData");

    try {
      const parsed = JSON.parse(authData);
      const token = parsed?.data?.token;
      const user = parsed?.data?.user;

      if (token && user) {
        setUser(user);
      } else if (!publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    } catch (e) {
      if (!publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
