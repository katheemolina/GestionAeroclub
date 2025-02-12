import { API_URL } from './apiUrl';

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

export const contadoresDeCuentas = async () => {
    const response = await fetch(`${API_URL}/contadoresDeCuentas`);
    if (!response.ok) {
        throw new Error('Error al obtener los indicadores');
    }
    return response.json();
};

export const obtenerUltimasCuentas = async () => {
    const response = await fetch(`${API_URL}/obtenerUltimasCuentas`);
    if (!response.ok) {
        throw new Error('Error al obtener los indicadores');
    }
    return response.json();
};


export const obtenerHorasPorDiaAeronaves = async () => {
    const response = await fetch(`${API_URL}/obtenerHorasPorDiaAeronaves`);
    if (!response.ok) {
        throw new Error('Error al obtener la informacion');
    }
    return response.json();
};

export const obtenerTopDeudores = async () => {
    const response = await fetch(`${API_URL}/obtenerTopDeudores`);
    if (!response.ok) {
        throw new Error('Error al obtener la informacion de los deudores');
    }
    return response.json();
};