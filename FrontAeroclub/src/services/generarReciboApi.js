import { API_URL } from './apiUrl';

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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reciboData),
        });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || 'Error desconocido';
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, devolvemos los datos
        return await response.json();
    } catch (error) {
        console.error('Error al generar el recibo:', error);
        // Devolver el error para que pueda ser manejado en el componente
        throw error;
    }
};

export const pagarReciboApi = async (idRecibos, IdUsuarioEvento) => {
    try {
        const response = await fetch(`${API_URL}/pagarRecibo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({  ids_movimientos: idRecibos,
                                    IdUsuarioEvento: IdUsuarioEvento
             }),
          });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || 'Error desconocido';
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, devolvemos los datos
        return await response.json();
    } catch (error) {
        console.error('Error al generar el recibo:', error);
        // Devolver el error para que pueda ser manejado en el componente
        throw error;
    }
};


export const armarLiquidacionApi = async (idMovimientos, IdUsuarioEvento) => {
    try {
        const response = await fetch(`${API_URL}/armarLiquidacion`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({  ids_movimientos: idMovimientos,
                                    IdUsuarioEvento: IdUsuarioEvento
             }),
          });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || 'Error desconocido';
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, devolvemos los datos
        return await response.json();
    } catch (error) {
        console.error('Error al generar el recibo:', error);
        // Devolver el error para que pueda ser manejado en el componente
        throw error;
    }
};