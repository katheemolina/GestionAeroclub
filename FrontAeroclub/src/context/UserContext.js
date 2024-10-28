import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

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
