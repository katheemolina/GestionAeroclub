import React from 'react';

function InstructorLibroVuelo() {
  const vuelos = [
    { fecha: '2024-09-25', aeronave: 'Cessna 172', horas: 2 },
    { fecha: '2024-09-28', aeronave: 'Piper PA-28', horas: 1.5 },
  ];

  return (
    <div className="content">
      <h1>Libro de Vuelo</h1>
      <ul>
        {vuelos.map((vuelo, index) => (
          <li key={index}>
            {vuelo.fecha} - {vuelo.aeronave} - {vuelo.horas} horas
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstructorLibroVuelo;
