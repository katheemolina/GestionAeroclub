import React from 'react';

function InstructorAsociados() {
  const Asociados = [
    { Nombre: 'Paco', Apellido: 'Perez', debe: 500 },
    { Nombre: 'David', Apellido: 'Ramirez', debe: 10000 },
    { Nombre: 'Martina', Apellido: 'Gonzalez', debe: 0 },
  ];

  return (
    <div className="content">
      <h1>Gestión de Aeronaves</h1>
      <ul>
        {Asociados.map((Asociado, index) => (
          <li key={index}>
            {Asociado.Apellido}, {Asociado.Nombre}. Debe: $ {Asociado.debe}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstructorAsociados;