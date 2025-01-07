import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useUser } from '../context/UserContext';
import './styles/RolesBnts.css';
import { obtenerRolPorIdUsuario } from '../services/usuariosApi';

function BotonesPorRol() {
  const { setRole } = useRole();
  const { usuarioId } = useUser(); // Usamos el usuarioId para obtener los roles
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolActivo, setRolActivo] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Controla la apertura del dropdown

  // Simulación de obtener roles desde una API
  const obtenerRolesDelAsociado = async () => {
    try {
      const response = await obtenerRolPorIdUsuario(usuarioId); // Suponiendo que esta API devuelve los roles del usuario
      const rolesActivos = response.filter(rol => rol.estado === 'activo');
      setRolesDisponibles(rolesActivos);
    } catch (error) {
      console.error('Error obteniendo los roles del asociado', error);
      setRolesDisponibles([]); // Si hay un error, no mostramos roles
    }
  };

  useEffect(() => {
    if (usuarioId) {
      obtenerRolesDelAsociado();
    }
  }, [usuarioId]);

  const handleButtonClick = (rol) => {
    setRole(rol);
    localStorage.setItem('role', rol);
    setRolActivo(rol);
    setIsOpen(false); // Cierra el dropdown al seleccionar una opción
  };

  return (
    <div className="menu-opciones">
      {rolesDisponibles.length === 0 ? (
        <p>Cargando roles...</p>
      ) : (
        <div className="dropdown-container">
          <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
            {rolActivo || "Selecciona un rol"}
          </div>
          {isOpen && (
            <ul className="dropdown-list">
              {rolesDisponibles.map((rol, index) => (
                <li
                  key={index}
                  onClick={() => handleButtonClick(rol.descripcion)}
                  className="dropdown-item"
                >
                  {rol.descripcion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default BotonesPorRol;
