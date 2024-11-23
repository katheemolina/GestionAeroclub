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
    try {
        const response = await fetch(`${API_URL}/vuelos/${idUsuario}/ultimosVuelos`);

        if (!response.ok) {
            console.error(`Error en la API: ${response.status} - ${response.statusText}`);
            return []; // Devolver un array vacío como valor seguro
        }

        const data = await response.json();

        // Validar que la respuesta sea un array
        if (!Array.isArray(data)) {
            console.warn("La respuesta no es un array, devolviendo un array vacío.");
            return [];
        }

        return data; // Devolver los datos si todo es correcto
    } catch (error) {
        console.error("Error al obtener los últimos vuelos:", error);
        return []; // Devolver un array vacío en caso de error
    }
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
