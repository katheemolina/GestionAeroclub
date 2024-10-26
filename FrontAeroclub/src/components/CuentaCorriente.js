import React from 'react';

function CuentaCorriente({ movimientos }) {
  return (
    <div>
      <h2>Estado de Cuenta Corriente</h2>
      <ul>
        {movimientos.map((mov, index) => (
          <li key={index}>
            {mov.fecha}: {mov.detalle} - ${mov.monto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CuentaCorriente;