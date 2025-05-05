import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, deleteToken } from "@/utils/secureStore";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      const token = await getToken("authToken");
      if (isMounted) {
        setIsAuthenticated(!!token);
        setLoading(false);
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    await deleteToken("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
