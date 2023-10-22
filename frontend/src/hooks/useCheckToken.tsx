import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

      const isTokenExpired = payload ? payload.exp < Date.now() / 1000 : true;

      if (isTokenExpired || token === null) {
        if (isTokenExpired || token === null) {
          localStorage.removeItem("token");
        }
        navigate("/MeteoPlus/login");
      }
    } catch (error) {
      console.error(error);
      navigate("/MeteoPlus/login");
      localStorage.removeItem("token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
