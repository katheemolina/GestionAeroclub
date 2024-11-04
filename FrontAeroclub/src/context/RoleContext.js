import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Inicializa el rol desde localStorage o usa 'asociado' como valor por defecto
  const [role, setRole] = useState(localStorage.getItem('role') || 'asociado');

  // Actualiza localStorage cuando el rol cambia
  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
