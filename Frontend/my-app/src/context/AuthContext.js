// context/AuthContext.js
"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("authData");

    try {
      const parsed = JSON.parse(authData);
      const token = parsed?.data?.token;
      const user = parsed?.data?.user;

      if (token && user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access user
export const useAuth = () => useContext(AuthContext);
