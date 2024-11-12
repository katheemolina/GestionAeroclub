import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { obtenerRolPorIdUsuario } from '../services/usuariosApi';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || 'asociado');
  const { usuarioId } = useUser();

  useEffect(() => {
    const fetchRole = async () => {
      if (usuarioId) {
        try {
          const role = await obtenerRolPorIdUsuario(usuarioId);
          setRole(role);
          localStorage.setItem('role', role);
          console.error(role);
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
          setRole('asociado'); 
        }
      }
    };

    fetchRole();
  }, [usuarioId]); // Solo se ejecuta cuando usuarioId cambia

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
