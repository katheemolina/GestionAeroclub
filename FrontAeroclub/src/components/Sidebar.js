import React from 'react';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import Boton from './Button';
import BotonesPorRol from './RolesBnts';
import '../styles/sidebar.css';

function Sidebar() {
  const { user } = useUser();
  const { role } = useRole();

  // Configuración de enlaces por rol
  const enlacesPorRol = {
    asociado: [
      { ruta: '/asociado/dashboard', texto: 'Inicio' },
      { ruta: '/asociado/perfil', texto: 'Mi Perfil' },
      { ruta: '/asociado/libro-vuelo', texto: 'Libro de Vuelo' },
      { ruta: '/asociado/cuenta-corriente', texto: 'Cuenta Corriente' },
      { ruta: '/asociado/aeronaves', texto: 'Aeronaves' },
      { ruta: '/asociado/tarifas', texto: 'Tarifas' },
      { ruta: '/logout', texto: 'Cerrar Sesión', logout: true },
    ],
    gestor: [
      { ruta: '/gestor/dashboard', texto: 'Inicio' },
      { ruta: '/gestor/recibos', texto: 'Recibos' },
      { ruta: '/gestor/vuelos', texto: 'Vuelos' },
      { ruta: '/gestor/cuenta-corriente', texto: 'Todos Los Movimientos' },
      { ruta: '/gestor/asociados', texto: 'Asociados' },
      { ruta: '/gestor/tarifas', texto: 'Tarifas' },
      { ruta: '/gestor/aeronaves', texto: 'Aeronaves' },
      { ruta: '/logout', texto: 'Cerrar Sesión', logout: true },
    ],
    instructor: [
      { ruta: '/instructor/dashboard', texto: 'Inicio' },
      { ruta: '/instructor/perfil', texto: 'Mi Perfil' },
      { ruta: '/instructor/libro-vuelo', texto: 'Libro de Vuelo' },
      { ruta: '/instructor/cuenta-corriente', texto: 'Cuenta Corriente' },
      { ruta: '/instructor/aeronaves', texto: 'Aeronaves' },
      { ruta: '/instructor/tarifas', texto: 'Tarifas' },
      { ruta: '/instructor/asociados', texto: 'Asociados' },
      { ruta: '/logout', texto: 'Cerrar Sesión', logout: true },
    ],
  };

  // Obtiene los enlaces correspondientes al rol actual
  const enlaces = enlacesPorRol[role] || [];

  return (
    
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-header-info">
          <span>{user ? user.name : 'ApellidoNombre'}</span>
          <hr className="divisor-header"/>
          {role.toUpperCase()}
        </div>
        <BotonesPorRol rol={role} /> {/* Botones para cambiar el rol */}
      </div>
      <div className="sidebar-navbar">
        {enlaces.map((enlace, index) => (
          <Boton
            key={index}
            estilos="sidebar-navbar-link"
            ruta={enlace.ruta}
            texto={enlace.texto}
            logout={enlace.logout || false}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
