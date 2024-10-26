import React from 'react';

function GestorAsociados() {
  const asociados = [
    { nombre: 'Juan Pérez', email: 'juan.perez@example.com', estado: 'Activo' },
    { nombre: 'Ana López', email: 'ana.lopez@example.com', estado: 'Inactivo' },
  ];

  return (
    <div className="content">
      <h1>Gestión de Asociados</h1>
      <ul>
        {asociados.map((asociado, index) => (
          <li key={index}>
            {asociado.nombre} ({asociado.estado}) - {asociado.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestorAsociados;
