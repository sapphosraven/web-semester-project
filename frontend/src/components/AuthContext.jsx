import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    async function fetchUserData() {
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          const response = await axios.get(`/users/${decodedToken.userId}`);
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data or invalid token:", error);
          cookies.remove("token");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    const cookies = new Cookies();
    cookies.remove("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
