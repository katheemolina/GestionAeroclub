import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser || null);

    useEffect(() => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook para usar el contexto
export function useUser() {
    return useContext(UserContext);
}
