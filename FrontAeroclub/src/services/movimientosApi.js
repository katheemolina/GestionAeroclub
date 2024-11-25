const API_URL = 'http://localhost:8000/api';

// Función para obtener el saldo de la cuenta corriente por usuario
export const obtenerSaldoCuentaCorrientePorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/movimientos/${idUsuario}/saldo`);
    if (!response.ok) {
        throw new Error('Error al obtener el saldo de la cuenta corriente');
    }
    return response.json();
};

// Función para obtener la cuenta corriente por usuario
export const obtenerCuentaCorrientePorUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/cuentaCorriente/${idUsuario}`);
    if (!response.ok) {
        throw new Error('Error al obtener la cuenta corriente');
    }
    return response.json();
};

// Función para obtener los movimientos no pagos
export const obtenerMovimientosNoPagos = async (id) => {
    const response = await fetch(`${API_URL}/movimientos/${id}/noPago`);
    if (!response.ok) {
        throw new Error('Error al obtener los movimientos no pagos');
    }
    return response.json();
};

// Función listar todos los asociados
export const obtenerTodosLosMovimientos = async () => {
    const response = await fetch(`${API_URL}/movimientos`);
    if (!response.ok) {
        throw new Error('Error al obtener todos los movimientos');
    }
    return response.json();
};

export const obtenerCuentaCorrienteAeroclub = async () => {
    const response = await fetch(`${API_URL}/movimientosAeroclub`);
    if (!response.ok) {
        throw new Error('Error al obtener la cuenta corriente del aeroclub');
    }
    return response.json();
};

export const obtenerCuentaCorrienteAeroclubDetalle = async (referenciaAeroclub) => {
    // Enviar una solicitud POST con el parámetro ReferenciaAeroclub
    const response = await fetch(`${API_URL}/obtenerCuentaCorrienteAeroclubDetalle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ReferenciaAeroclub: referenciaAeroclub }), // Pasamos el parámetro en el cuerpo de la solicitud
    });

    if (!response.ok) {
        throw new Error('Error al obtener la cuenta corriente del aeroclub');
    }

    // Parsear la respuesta JSON y retornarla
    return response.json();
};
