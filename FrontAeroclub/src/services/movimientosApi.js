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
    const response = await fetch(`${API_URL}/movimientos/${idUsuario}`);
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