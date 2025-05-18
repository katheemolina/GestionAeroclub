import { toast } from 'react-toastify';
import { API_URL } from './apiUrl';

export const generarCuotasSociales = async (reciboData) => {
    try {
        const response = await fetch(`${API_URL}/generarCuotasSociales`, {
            method: 'POST',  // Usamos POST porque es el método esperado en el backend
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reciboData),
        });

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Error desconocido';

            // Verificamos si el código de estado es 409 (conflicto)
            if (response.status === 409) {
                throw new Error(errorMessage);  // Lanza un error con el mensaje específico
            }

            // Para otros errores, simplemente los lanzamos como son
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, devolvemos los datos
        toast.success(`Los datos se han guardado correctamente.`);
        return await response.json();
    } catch (error) {
        toast.error(`Los datos no se han guardado. ${error.message}`);
        throw error;
    }
};

export const obtenerCSGeneradas = async () => {
    try {
        const response = await fetch(`${API_URL}/obtenerCSGeneradas`);
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Error desconocido al obtener datos.';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        toast.success('Cuotas sociales obtenidas correctamente.');
        return data;
    } catch (error) {
        toast.error(`Error al obtener cuotas sociales. ${error.message}`);
        throw error;
    }
}; 