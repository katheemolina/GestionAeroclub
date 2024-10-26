import React from 'react';
import CuentaCorriente from '../../components/CuentaCorriente';

function InstructorCuentaCorriente() {
  const movimientos = [
    { fecha: '2024-10-01', detalle: 'Vuelo', monto: -1000 },
    { fecha: '2024-10-05', detalle: 'Pago de cuota', monto: 500 },
  ];

  return (
    <div className="content">
      <h1>Cuenta Corriente</h1>
      <CuentaCorriente movimientos={movimientos} />
    </div>
  );
}

export default InstructorCuentaCorriente;
