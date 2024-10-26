import React from 'react';

function InstructorPerfil() {
  const usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    cmaVencimiento: '2024-12-01',
  };

  return (
    <div className="content">
      <h1>Perfil</h1>
      <p>Nombre: {usuario.nombre}</p>
      <p>Email: {usuario.email}</p>
      <p>Vencimiento CMA: {usuario.cmaVencimiento}</p>
    </div>
  );
}

export default InstructorPerfil;
