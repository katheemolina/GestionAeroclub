const API_URL = 'http://localhost:8000/api';

// Función para obtener todas las aeronaves
export const obtenerAeronaves = async () => {
    try {
        const response = await fetch(`${API_URL}/aeronaves`);
        if (!response.ok) {
            throw new Error('Error al obtener las aeronaves');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para insertar una nueva aeronave
export const insertarAeronave = async (Data) => {
    try {
        console.log(JSON.stringify(Data))
        const response = await fetch(`${API_URL}/aeronaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Data) 
        });
        
        if (!response.ok) {
            throw new Error('Error al insertar la aeronave');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para actualizar una aeronave existente
export const actualizarAeronave = async (id, Data) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Data),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar la aeronave');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function eliminarAeronave(idAeronave) {
    try {
        const response = await fetch(`${API_URL}/aeronave/eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdAeronave: idAeronave })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error eliminando aeronave');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const cambiarEstadoAeronave = async (idAeronave) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_aeronave: idAeronave }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al cambiar el estado de la aeronave:', error);
        throw error.message;
    }
};

export const cambiarDatosPoliza = async (idAeronave, aseguradora, numeroPoliza, vencimientoPoliza) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves/poliza`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_aeronave: idAeronave,
                aseguradora,
                numero_poliza: numeroPoliza,
                vencimiento_poliza: vencimientoPoliza,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar los datos de la póliza:', error);
        throw error.message;
    }
};

// Servicio para actualizar el intervalo de inspección
export const actualizarIntervaloInspeccion = async (idAeronave, intervaloInspeccion) => {
    try {
        const response = await fetch(`${API_URL}/aeronaves/inspeccion`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_aeronave: idAeronave,
                intervalo_inspeccion: intervaloInspeccion,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el intervalo de inspección:', error);
        throw error.message;
    }
};

