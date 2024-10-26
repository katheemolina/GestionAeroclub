import React from 'react';
import CuentaCorriente from '../../components/CuentaCorriente';

function GestorCuentaCorriente() {
  const movimientos = [
    { fecha: '2024-10-01', detalle: 'Pago de cuota', monto: 500 },
    { fecha: '2024-10-02', detalle: 'Vuelo instrucción', monto: -1000 },
  ];

  return (
    <div className="content">
      <h1>Cuenta Corriente del Club</h1>
      <CuentaCorriente movimientos={movimientos} />
    </div>
  );
}

export default GestorCuentaCorriente;
