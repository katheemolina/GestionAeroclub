import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, getUserProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Aquí podrías cargar el perfil del usuario desde el token guardado en localStorage.
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('User is not authenticated');
        setIsAuthenticated(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
