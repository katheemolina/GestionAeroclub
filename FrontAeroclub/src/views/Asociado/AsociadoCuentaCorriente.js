import { useState, useEffect } from 'react';
import React from 'react';
import CuentaCorriente from '../../components/CuentaCorriente';
import { apiCuentaCorriente } from '../../services/apiCuentaCorriente.ts';
import { apiUsuarios } from '../../services/apiUsuarios.ts';

function AsociadoCuentaCorriente() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  const getSaldo = async (id) => {
    try {
      const response = await apiCuentaCorriente.getById(id);
      return parseInt(response); // Asegúrate de que `response` sea un número
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  const fetchData = async () => {
    const saldo = await getSaldo(1); // Obtener el saldo
    const nuevosMovimientos = [
      { fecha: '2024-10-01', detalle: 'Vuelo', monto: saldo }, // Usa el saldo obtenido
      { fecha: '2024-10-05', detalle: 'Pago de cuota', monto: 500 },
    ];
    setMovimientos(nuevosMovimientos); // Actualiza el estado con los nuevos movimientos
    setLoading(false); // Cambia el estado de carga
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="content"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="content">
      <h1>Cuenta Corriente</h1>
      <CuentaCorriente movimientos={movimientos} />
    </div>
  );
}

export default AsociadoCuentaCorriente;
