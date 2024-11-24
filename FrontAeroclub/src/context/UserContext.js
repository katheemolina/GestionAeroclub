import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerIdUsuarioDesdeMail } from '../services/usuariosApi';
import { obtenerEstadoDelUsuario } from '../services/ingresoApi';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser || null);
    const [usuarioId, setUsuarioId] = useState(null); // Estado para el UsuarioId
    const [isUserEnabled, setIsUserEnabled] = useState(true); 
    const isAuthenticated = !!user;
    
    
    
    useEffect(() => {
        const fetchUserId = async () => {
            if (user) {
                try {
                    const idUsuario = await obtenerIdUsuarioDesdeMail(user);
                    setUsuarioId(idUsuario.id_usuario); // Guarda el ID en el contexto
                } catch (error) {
                    console.error('Error al obtener el ID de Usuario:', error);
                }
            }
        };
    
        fetchUserId();
    }, [user]);
    
    useEffect(() => {
        const fetchUserIsEnabled = async () => {
            if (user && usuarioId) { 
                try {
                    const isEnabled = await obtenerEstadoDelUsuario(usuarioId);
                    setIsUserEnabled(isEnabled.data.estado?.toLowerCase() === "habilitado" ? true : false);
                } catch (error) {
                    console.error('Earror al obtener el estado del Usuario:', error);
                }
            }
        };
    
        fetchUserIsEnabled();
    }, [user, usuarioId]); //  usuarioId como dependencia
    

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, usuarioId, setUsuarioId, isAuthenticated, isUserEnabled}}>
            {children}
        </UserContext.Provider>
    );
}

// Hook para usar el contexto
export function useUser() {
    return useContext(UserContext);
}