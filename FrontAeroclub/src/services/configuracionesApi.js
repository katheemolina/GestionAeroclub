// tarifasApi.js

const API_URL = 'http://localhost:8000/api';

// Función para obtener todas las tarifas
export const obtenerConfiguraciones = async () => {
    try {
        const response = await fetch(`${API_URL}/configuraciones`);
        if (!response.ok) {
            throw new Error('Error al obtener las configuraciones');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para actualizar una tarifa existente
export const actualizarConfiguraciones = async (configuracionData) => {
    try {
        const response = await fetch(`${API_URL}/configuracionesActualizar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(configuracionData),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar la configuracion');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};