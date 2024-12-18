import { API_URL } from './apiUrl';

// Función para obtener todos los recibos
export const obtenerTodosLosRecibos = async () => {
    const response = await fetch(`${API_URL}/recibos`);
    if (!response.ok) {
        throw new Error('Error al obtener todos los recibos');
    }
    return response.json();
};