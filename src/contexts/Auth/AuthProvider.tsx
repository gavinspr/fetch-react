import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { AuthContextType } from "../../types";
import { apiRequest } from "../../utils";
import { useNavigate } from "react-router-dom";

type PropTypes = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: PropTypes) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiRequest("/dogs/breeds");
      setIsAuthenticated(response.ok);

      if (response.status === 401) navigate("/login");
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkAuth, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
