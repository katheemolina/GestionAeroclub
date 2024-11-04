const API_URL = 'http://localhost:8000/api';

// Función para obtener las horas voladas por un usuario
export const horasVoladasPorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/vuelos/${idUsuario}/horasVoladas`);
    if (!response.ok) {
        throw new Error('Error al obtener las horas voladas');
    }
    return response.json();
};

// Función para obtener los últimos vuelos de un usuario
export const ultimosVuelosPorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/vuelos/${idUsuario}/ultimosVuelos`);
    if (!response.ok) {
        throw new Error('Error al obtener los últimos vuelos');
    }
    return response.json();
};

// Función para obtener el libro de vuelo de un usuario
export const obtenerLibroDeVueloPorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/vuelos/${idUsuario}/libroVuelo`);
    if (!response.ok) {
        throw new Error('Error al obtener el libro de vuelo');
    }
    return response.json();
};

//Funcion para obtener todos los itinerarios
export const obtenerTodosLosItinerarios = async () => {
    const response = await fetch(`${API_URL}/itinerarios`);
    if (!response.ok) {
        throw new Error('Error al obtener todos los itinerarios');
    }
    return response.json();
};
