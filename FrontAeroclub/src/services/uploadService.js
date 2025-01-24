import { API_URL } from './apiUrl';

export const guardarRutaDeImagen = async (rutaImagen) => {
    const response = await fetch(`${API_URL}/guardar-imagen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rutaImagen }), // Enviamos la ruta de la imagen
    });

    if (!response.ok) {
        throw new Error('Error al guardar la ruta de la imagen');
    }

    return response.json(); // Retorna la respuesta del backend
};

  