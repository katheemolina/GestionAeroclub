const API_URL = 'http://localhost:8000/api';

// Función para obtener los datos de un usuario
export const obtenerDatosDelUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}`);
    if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
    }
    return response.json();
};

// Función para obtener el estado del CMA de un usuario
export const obtenerEstadoCMA = async (idUsuario) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}/cma`);
    if (!response.ok) {
        throw new Error('Error al obtener el estado del CMA');
    }
    return response.json();
};

// Función para obtener las licencias de un usuario
export const obtenerLicenciasPorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}/licencias`);
    if (!response.ok) {
        throw new Error('Error al obtener las licencias del usuario');
    }
    return response.json();
};

// Función para actualizar los datos del usuario
export const actualizarDatosDelUsuario = async (id, datos) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
    }
    return response.json();
};

// Función listar todos los asociados
export const listarAsociados = async () => {
    const response = await fetch(`${API_URL}/asociados`);
    if (!response.ok) {
        throw new Error('Error al listar asociados');
    }
    return response.json();
};