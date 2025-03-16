import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { obtenerRolPorIdUsuario } from '../services/usuariosApi';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || 'undefined');
  const { usuarioId } = useUser();

  useEffect(() => {
    const fetchRole = async () => {
      if (usuarioId) {
        try {
          const roles = await obtenerRolPorIdUsuario(usuarioId);
          // Filtrar roles activos
          const activeRoles = roles.filter(role => role.estado === 'activo');
          // Si hay roles activos, asignamos el primero; si no, se asigna 'asociado'
          if (activeRoles.length > 0) {
            setRole(activeRoles[0].descripcion);
            localStorage.setItem('role', activeRoles[0].descripcion);
          } else {
            setRole('asociado'); 
            localStorage.setItem('role', 'asociado');
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
          setRole('asociado'); 
          localStorage.setItem('role', 'asociado');
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
