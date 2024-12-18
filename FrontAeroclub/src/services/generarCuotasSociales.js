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
        return await response.json();
    } catch (error) {
        console.error('Error al generar las cuotas sociales:', error.message);
        // Devolver el error para que pueda ser manejado en el componente
        throw error;
    }
};
