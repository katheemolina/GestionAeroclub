import React from 'react';

function GestorAeronaves() {
  const Aeronaves = [
    { concepto: 'Aeronave 2', combustible: 50 },
    { concepto: 'Aeronave 2', combustible: 70 },
  ];

  return (
    <div className="content">
      <h1>Gestión de Aeronaves</h1>
      <ul>
        {Aeronaves.map((Aeronave, index) => (
          <li key={index}>
            {Aeronave.concepto}. Combustible {Aeronave.combustible} %
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestorAeronaves;
