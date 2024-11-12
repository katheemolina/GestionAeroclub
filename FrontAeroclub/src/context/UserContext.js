import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerIdUsuarioDesdeMail } from '../services/usuariosApi';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser || null);
    const [usuarioId, setUsuarioId] = useState(null); // Estado para el UsuarioId
    const isAuthenticated = !!user;

    
    useEffect(() => {
        const fetchUserId = async () => {
            if (user) {
                try {
                    const idUsuario = await obtenerIdUsuarioDesdeMail(user);
                    console.log('ID de Usuario:', idUsuario);
                    setUsuarioId(idUsuario); // Guarda el ID en el contexto
                } catch (error) {
                    console.error('Error al obtener el ID de Usuario:', error);
                    setUsuarioId(1);
                }
            }
        };

        fetchUserId();
    }, [user, setUsuarioId]);


    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, usuarioId, setUsuarioId, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    );
}

// Hook para usar el contexto
export function useUser() {
    return useContext(UserContext);
}


