const API_URL = 'http://localhost:8000/api';



export const obtenerServicios = async (id_aeronave) => {
    const response = await fetch(`${API_URL}/serviciosAeronaves/${id_aeronave}`);
    if (!response.ok) {
        throw new Error('Error al obtener el servicios para esta aeronave');
    }
    return response.json();
};


export const insertarServicio = async (servicioData) => {
    try {
        const response = await fetch(`${API_URL}/serviciosAeronaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicioData),
        });
        
        if (!response.ok) {
            throw new Error('Error al insertar el servicio');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const actualizarServicio = async (id_aeronave, servicioData) => {
    try {
        const response = await fetch(`${API_URL}/serviciosAeronaves/${id_aeronave}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicioData),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el servicio');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

