import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerIdUsuarioDesdeMail } from '../services/usuariosApi';
import { obtenerEstadoDelUsuario } from '../services/ingresoApi';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser || null);
    const [usuarioId, setUsuarioId] = useState(null);
    const [isUserEnabled, setIsUserEnabled] = useState(null); // Ahora puede ser null al inicio
    const [PerfilIncompleto, setPerfilIncompleto] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true); // Estado para saber si ya cargó
    const isAuthenticated = !!user;

    useEffect(() => {
        const inicializarUsuario = async () => {
            if (!user) {
                setLoadingUserData(false);
                return;
            }

            try {
                const idUsuario = await obtenerIdUsuarioDesdeMail(user);
                setUsuarioId(idUsuario.id_usuario);

                const estado = await obtenerEstadoDelUsuario(idUsuario.id_usuario);
                setIsUserEnabled(estado.data.estado?.toLowerCase() === "habilitado");
                setPerfilIncompleto(estado.data.FaltanDatos === 0);
            } catch (error) {
                console.error('Error al inicializar datos del usuario:', error);
                setIsUserEnabled(false);
                setPerfilIncompleto(false);
            } finally {
                setLoadingUserData(false);
            }
        };

        inicializarUsuario();
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            usuarioId,
            setUsuarioId,
            isAuthenticated,
            isUserEnabled,
            PerfilIncompleto,
            loadingUserData
        }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook para usar el contexto
export function useUser() {
    return useContext(UserContext);
}
