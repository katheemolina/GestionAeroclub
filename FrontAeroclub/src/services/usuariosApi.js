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

// Función para obtener el IdUsuario con el Email de la persona
export const obtenerIdUsuarioDesdeMail = async (email) => {
    const response = await fetch(`${API_URL}/usuarios/idusuario/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.email,  // Enviamos el estado (habilitado o deshabilitado)
        }),
    });
    if (!response.ok) {
        throw new Error('Error al obtener el id del usuario');
    }
    return response.json();
};

export const obtenerRolPorIdUsuario = async (usuarioId) => {
    const response = await fetch(`${API_URL}/roles/${usuarioId}`);
    if (!response.ok) {
        throw new Error('Error al listar asociados');
    }
    return response.json();
};

export const actualizarEstadoAsociado = async (usuarioId, estado) => {
    try {
        // Hacemos la solicitud PUT a la API
        const response = await fetch(`${API_URL}/modificarEstado/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Estado: estado,  // Enviamos el estado (habilitado o deshabilitado)
            }),
        });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            throw new Error('Error al modificar el estado del asociado');
        }

        // Devolvemos la respuesta si la solicitud es exitosa
        return await response.json();
    } catch (error) {
        console.error('Error al modificar el estado del asociado:', error);
        throw error;  // Lanza el error para que el componente lo maneje
    }
};

export const actualizarLicencias = async (idUsuario, licencias) => {
    try {
        // Realizar la solicitud PUT a la API
        const response = await fetch(`${API_URL}/usuarios/${idUsuario}/licencias`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(licencias),  // Convertimos el array de licencias a JSON
        });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            throw new Error('Error al actualizar las licencias');
        }

        // Devolvemos la respuesta si la solicitud es exitosa
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar las licencias:', error);
        throw error;  // Lanza el error para que el componente lo maneje
    }
};


