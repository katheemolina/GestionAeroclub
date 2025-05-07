import React, { useEffect, useRef, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useUser } from '../context/UserContext';
import './styles/RolesBnts.css';
import { obtenerRolPorIdUsuario } from '../services/usuariosApi';

function BotonesPorRol() {
  const { setRole } = useRole();
  const { usuarioId } = useUser();
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolActivo, setRolActivo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null); // Ref para el dropdown

  // Simulación de obtener roles desde una API
  const obtenerRolesDelAsociado = async () => {
    try {
      const response = await obtenerRolPorIdUsuario(usuarioId);
      const rolesActivos = response.filter((rol) => rol.estado === 'activo');
      setRolesDisponibles(rolesActivos);
    } catch (error) {
      console.error('Error obteniendo los roles del asociado', error);
      setRolesDisponibles([]);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      obtenerRolesDelAsociado();
    }
  }, [usuarioId]);


  useEffect(() => {

    const rolEnUso = localStorage.getItem('role')
    if (rolEnUso) {
      handleButtonClick(rolEnUso)
    }
    else if (rolesDisponibles.length === 1 && !rolActivo) {
      handleButtonClick(rolesDisponibles[0].descripcion);
    }

  }, [rolesDisponibles]);

  const handleButtonClick = (rol) => {
    setRole(rol);
    localStorage.setItem('role', rol);
    setRolActivo(rol);
    setIsOpen(false); // Cierra el dropdown al seleccionar un rol
  };

  const handleClickOutside = (event) => {
    // Verifica si el clic ocurrió fuera del dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Agrega un listener para detectar clics fuera del dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Limpia el listener cuando el componente se desmonta
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-opciones" ref={dropdownRef}>
      {rolesDisponibles.length === 0 ? (
        <p>Cargando roles...</p>
      ) : (
        <div className="dropdown-container">
          <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
            {rolActivo || 'Selecciona un rol'}
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
