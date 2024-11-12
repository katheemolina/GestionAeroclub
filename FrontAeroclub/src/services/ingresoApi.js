const API_URL = 'http://localhost:8000/api';

export const verificarOCrearUsuario = async (usuarioData) => {
    try {
        const response = await fetch(`${API_URL}/verificarUsuario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioData),
        });

        if (!response.ok) {
            throw new Error('Error al insertar usuario');
        }
        
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};