import { API_URL } from './apiUrl';

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

export async function eliminarTarifa(idTarifa) {
    try {
        const response = await fetch(`${API_URL}/tarifa/eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdTarifa: idTarifa })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error eliminando tarifa');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para obtener todas las tarifas de combustible
export const obtenerTarifasCombustible = async () => {
    try {
        const response = await fetch(`${API_URL}/tarifasCombustible`);
        if (!response.ok) {
            throw new Error('Error al obtener las tarifas');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};