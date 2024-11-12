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

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            throw new Error('Error al generar el recibo');
        }

        // Devolvemos la respuesta si la solicitud es exitosa
        return await response.json();
    } catch (error) {
        console.error('Error al generar el recibo:', error);
        throw error;  // Lanza el error para que el componente lo maneje
    }
};