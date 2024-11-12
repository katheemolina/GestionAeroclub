import React from 'react';
import { useRole } from '../context/RoleContext';
import './styles/RolesBnts.css';

const rolesConfig = {
  asociado: [
    { label: "Asociado", nuevoRol: "asociado" },
    { label: "Gestor", nuevoRol: "gestor" },
    { label: "Instructor", nuevoRol: "instructor" },
  ],
  gestor: [
    { label: "Asociado", nuevoRol: "asociado" },
    { label: "Gestor", nuevoRol: "gestor" },
    { label: "Instructor", nuevoRol: "instructor" },
  ],
  instructor: [
    { label: "Asociado", nuevoRol: "asociado" },
    { label: "Gestor", nuevoRol: "gestor" },
    { label: "Instructor", nuevoRol: "instructor" },
  ],
};

function BotonesPorRol({ rol }) {
  const { setRole } = useRole();

  const botones = rolesConfig[rol] || [];

  const handleButtonClick = (boton) => {
    if (boton.nuevoRol[0].descripcion ) {
      setRole(boton.nuevoRol[0].descripcion );
      localStorage.setItem('role', boton.nuevoRol[0].descripcion );
    }
  };

  return (
    <div className="menu-opciones">
      {botones.map((boton, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(boton)}
          className={`opcion-boton ${rol === boton.nuevoRol[0].descripcion ? 'activo' : ''}`}
        >
          {boton.label}
        </button>
      ))}
    </div>
  );
}

export default BotonesPorRol;