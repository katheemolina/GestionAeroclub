import { API_URL } from './apiUrl';

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

// Función para obtener los tipos de licencias de la base
export const obtenerLicencias = async () => {
    const response = await fetch(`${API_URL}/licencias`)
    if (!response.ok) {
        throw new Error('Error al obtener las licencias');
    }
    return response.json();
}

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
    const response = await fetch(`${API_URL}/obtenerUsuario/${email.email}`, {
        method: 'GET',
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

export async function actualizarRoles(idUsuario, roles) {
    try {
        const response = await fetch(`${API_URL}/usuario/actualizarRoles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IdUsuario: idUsuario,
                Roles: JSON.stringify(roles),  // Serializa roles a una cadena JSON
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error actualizando roles');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function eliminarRol(idUsuario, idRol) {
    try {
        const response = await fetch(`${API_URL}/usuario/eliminarRol`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdUsuario: idUsuario, IdRol: idRol })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error eliminando rol');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function habilitarUsuario(idUsuario) {
    try {
        const response = await fetch(`${API_URL}/usuario/habilitar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdUsuario: idUsuario })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error habilitando usuario');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function deshabilitarUsuario(idUsuario) {
    try {
        const response = await fetch(`${API_URL}/usuario/deshabilitar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdUsuario: idUsuario })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error deshabilitando usuario');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const actualizarLicencias = async (datos) => {
    try {
        // Realizar la solicitud PUT a la API
        const response = await fetch(`${API_URL}/licencias/actualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),  // Convertimos el array que contiene a la licencia a JSON
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

export const eliminarLicencia = async (datos) => {
    try{

        const response = await fetch(`${API_URL}/licencias/eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),  // Convertimos el array que contiene a la licencia a JSON
        });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            throw new Error('Error al actualizar las licencias');
        }

        // Devolvemos la respuesta si la solicitud es exitosa
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar la licencia :', error);
        throw error;  // Lanza el error para que el componente lo maneje
    }
}

// Función listar todos los asociados
export const movimientosNoLiquidadosPorInstructor = async () => {
    const response = await fetch(`${API_URL}/movimientosNoLiquidadosPorInstructor`);
    if (!response.ok) {
        throw new Error('Error al listar instructores');
    }
    return response.json();
};

export const tarifaEspecial = async (idUsuario, valor) => {
    try {
        const response = await fetch(`${API_URL}/usuario/tarifa-especial`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_usuario: idUsuario, modifica: valor}), 
        });

        if (!response.ok) {
            throw new Error(`Error al modificar tarifa especial: ${response.statusText}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error en modificar la tarifa especial:", error);
        return { success: false, message: "No se pudo modificar la tarifa" };
    }
};