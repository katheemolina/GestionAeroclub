// tarifasApi.js

const API_URL = 'http://localhost:8000/api';

// Función para obtener todas las tarifas
export const obtenerTarifas = async () => {
    try {
        const response = await fetch(`${API_URL}/tarifas`);
        if (!response.ok) {
            throw new Error('Error al obtener las tarifas');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para insertar una nueva tarifa
export const insertarTarifa = async (tarifaData) => {
    try {
        const response = await fetch(`${API_URL}/tarifas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarifaData),
        });
        
        if (!response.ok) {
            throw new Error('Error al insertar la tarifa');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para actualizar una tarifa existente
export const actualizarTarifa = async (id, tarifaData) => {
    try {
        const response = await fetch(`${API_URL}/tarifas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarifaData),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar la tarifa');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
