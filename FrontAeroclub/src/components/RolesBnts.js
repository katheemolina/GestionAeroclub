// import React from 'react';
// import { useRole } from '../context/RoleContext'; // Importa el contexto del rol
// import './styles/RolesBnts.css';

// // Configuración de botones por roles
// const rolesConfig = {
//   asociado: [
//     { label: "Ver Perfil", onClick: () => console.log("Ver Perfil") },
//     { label: "Cambiar a Gestor", nuevoRol: "gestor" },
//     { label: "Cambiar a Instructor", nuevoRol: "instructor" },
//   ],
//   gestor: [
//     { label: "Gestionar Asociados", onClick: () => console.log("Gestionar Asociados") },
//     { label: "Cambiar a Asociado", nuevoRol: "asociado" },
//     { label: "Cambiar a Instructor", nuevoRol: "instructor" },
//   ],
//   instructor: [
//     { label: "Ver Vuelos", onClick: () => console.log("Ver Vuelos") },
//     { label: "Cambiar a Asociado", nuevoRol: "asociado" },
//     { label: "Cambiar a Gestor", nuevoRol: "gestor" },
//   ],
// };

// function BotonesPorRol({ rol }) {
//   const { setRole } = useRole(); // Usa el contexto del rol

//   // Obtener los botones del rol proporcionado
//   const botones = rolesConfig[rol] || [];

//   // Manejar el clic en un botón que cambia el rol
//   const handleButtonClick = (boton) => {
//     if (boton.onClick) {
//       boton.onClick(); // Ejecuta la acción del botón si existe
//     }
//     if (boton.nuevoRol) {
//       setRole(boton.nuevoRol); // Cambia el rol en el contexto
//       localStorage.setItem('role', boton.nuevoRol); // Guarda el nuevo rol en localStorage
//     }
//   };

//   return (
//     <div className="botones-por-rol">
//       {botones.map((boton, index) => (
//         <button key={index} onClick={() => handleButtonClick(boton)}>
//           {boton.label}
//         </button>
//       ))}
//     </div>
//   );
// }

// export default BotonesPorRol;


import React, { useState } from 'react';
import { useRole } from '../context/RoleContext'; // Importa el contexto del rol
import './styles/RolesBnts.css';

// Configuración de botones por roles
const rolesConfig = {
  asociado: [
    { label: "Cambiar a Gestor", nuevoRol: "gestor" },
    { label: "Cambiar a Instructor", nuevoRol: "instructor" },
  ],
  gestor: [
    { label: "Cambiar a Asociado", nuevoRol: "asociado" },
    { label: "Cambiar a Instructor", nuevoRol: "instructor" },
  ],
  instructor: [
    { label: "Cambiar a Asociado", nuevoRol: "asociado" },
    { label: "Cambiar a Gestor", nuevoRol: "gestor" },
  ],
};

function BotonesPorRol({ rol }) {
  const { setRole } = useRole(); // Usa el contexto del rol
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar el menú desplegable

  // Obtener los botones del rol proporcionado
  const botones = rolesConfig[rol] || [];

  // Manejar el clic en un botón que cambia el rol
  const handleButtonClick = (boton) => {
    if (boton.onClick) {
      boton.onClick(); // Ejecuta la acción del botón si existe
    }
    if (boton.nuevoRol) {
      setRole(boton.nuevoRol); // Cambia el rol en el contexto
      localStorage.setItem('role', boton.nuevoRol); // Guarda el nuevo rol en localStorage
    }
    setMenuAbierto(false); // Cierra el menú después de hacer clic
  };

  // Manejar el clic para abrir o cerrar el menú
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="menu-desplegable">
      <button className="menu-principal" onClick={toggleMenu}>
        Cambiar de Rol
      </button>
      {menuAbierto && (
        <div className="menu-opciones">
          {botones.map((boton, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(boton)}
              className="opcion-boton"
            >
              {boton.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BotonesPorRol;
