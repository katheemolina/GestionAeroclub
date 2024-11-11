const API_URL = 'http://localhost:8000/api';

// Función para obtener todos los tipos vuelo
export const obtenerTiposVuelos = async () => {
    const response = await fetch(`${API_URL}/obtenerTiposVuelos`);
    if (!response.ok) {
        throw new Error('Error al obtener los tipos vuelo');
    }
    return response.json();
};

// Función para obtener todos los instructores
export const listarInstructores = async () => {
    const response = await fetch(`${API_URL}/obtenerInstructores`);
    if (!response.ok) {
        throw new Error('Error al obtener los instructores');
    }
    return response.json();
};

export const generarReciboApi = async (reciboData) => {
    try {
        const response = await fetch(`${API_URL}/generarRecibo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reciboData),
        });

        const result = await response.json();
        return result; // Aquí se espera una respuesta de la API
    } catch (error) {
        console.error("Error en la llamada API:", error);
        throw error; // Para poder manejarlo en el componente
    }
};