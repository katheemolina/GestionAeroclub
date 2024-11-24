const API_URL = 'http://localhost:8000/api';

// Función para obtener las horas de vuelo del último mes
export const obtenerHorasVueloUltimoMes = async () => {
    const response = await fetch(`${API_URL}/horasUltimoMes`);
    if (!response.ok) {
        throw new Error('Error al obtener las horas de vuelo del último mes');
    }
    return response.json();
};



// Función para obtener el saldo de la cuenta corriente del aeroclub
export const obtenerSaldoCuentaCorrienteAeroclub = async () => {
    const response = await fetch(`${API_URL}/saldoAeroclub`);
    if (!response.ok) {
        throw new Error('Error al obtener el saldo de la cuenta corriente del aeroclub');
    }
    return response.json();
};
