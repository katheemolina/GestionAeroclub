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

  // Simulación de obtener roles desde una API
  const obtenerRolesDelAsociado = async () => {
    try {
      // Reemplaza con tu llamada a la API para obtener los roles
      const response = await obtenerRolPorIdUsuario(usuarioId); // Suponiendo que esta API devuelve los roles del usuario

      // Filtrar roles activos
      const rolesActivos = response.filter(rol => rol.estado === 'activo');
      setRolesDisponibles(rolesActivos);
    } catch (error) {
      console.error('Error obteniendo los roles del asociado', error);
      setRolesDisponibles([]); // Si hay un error, no mostramos roles
    }
  };

  // Llamamos a la función cuando cambia el usuarioId
  useEffect(() => {
    if (usuarioId) {
      obtenerRolesDelAsociado();
    }
  }, [usuarioId]);

  // Generamos dinámicamente los botones en función de los roles
  const handleButtonClick = (rol) => {
    setRole(rol);
    localStorage.setItem('role', rol);
    setRolActivo(rol);
  };

  return (
    <div className="menu-opciones">
  {rolesDisponibles.length === 0 ? (
    <p>Cargando roles...</p>
  ) : (
    <select 
      onChange={(e) => handleButtonClick(e.target.value)} 
      value={rolActivo} 
      className="opciones-select"
    >
      {rolesDisponibles.map((rol, index) => (
        <option key={index} value={rol.descripcion}>
          {rol.descripcion}
        </option>
      ))}
    </select>
  )}
</div>

  );
}

export default BotonesPorRol;
