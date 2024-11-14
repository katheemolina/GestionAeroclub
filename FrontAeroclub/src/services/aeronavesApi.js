const API_URL = 'http://localhost:8000/api';

// Función para obtener todas las aeronaves
export const obtenerAeronaves = async () => {
    try {
        const response = await fetch(`${API_URL}/aeronaves`);
        if (!response.ok) {
            throw new Error('Error al obtener las aeronaves');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para insertar una nueva aeronave
export const insertarAeronave = async (Data) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Data),
        });
        
        if (!response.ok) {
            throw new Error('Error al insertar la aeronave');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para actualizar una aeronave existente
export const actualizarAeronave = async (id, Data) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Data),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar la aeronave');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function eliminarAeronave(idAeronave) {
    try {
        const response = await fetch(`${API_URL}/aeronave/eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdAeronave: idAeronave })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error eliminando aeronave');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}