// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access-token'); // Get token from localStorage
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false)
    }
    setIsLoading(false); // Set loading to false when token is found or not found
  }, []);

  const login = (token) => {
    console.log('login');
    localStorage.setItem('access-token', token);
    setIsAuthenticated(true);
    router.push('/'); // Redirect to your admin dashboard or home page
  };

  const logout = () => {
    console.log('logout');
    localStorage.removeItem('access-token');
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout , isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
