import React from 'react';

function GestorTarifas() {
  const tarifas = [
    { concepto: 'Vuelo', monto: 1500 },
    { concepto: 'Combustible', monto: 500 },
  ];

  return (
    <div className="content">
      <h1>Gestión de Tarifas</h1>
      <ul>
        {tarifas.map((tarifa, index) => (
          <li key={index}>
            {tarifa.concepto}: ${tarifa.monto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestorTarifas;
