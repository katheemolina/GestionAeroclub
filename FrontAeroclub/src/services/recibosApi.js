import { API_URL } from './apiUrl';

// Función para obtener todos los recibos
export const obtenerTodosLosRecibos = async () => {
    const response = await fetch(`${API_URL}/recibos`);
    if (!response.ok) {
        throw new Error('Error al obtener todos los recibos');
    }
    return response.json();
};

export const anularRecibo = async (idRecibo) => {
    try {
        const response = await fetch(`${API_URL}/anular-recibo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ numero_recibo: idRecibo }), // Cambio aquí
        });

        if (!response.ok) {
            throw new Error(`Error al anular el recibo: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Devuelve la respuesta del backend
    } catch (error) {
        console.error("Error en anularRecibo:", error);
        return { success: false, message: "No se pudo anular el recibo" };
    }
};

