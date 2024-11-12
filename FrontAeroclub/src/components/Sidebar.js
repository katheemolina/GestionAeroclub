import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import { useLocation } from 'react-router-dom';
import Boton from './Button';
import BotonesPorRol from './RolesBnts';
import '../styles/sidebar.css';

function Sidebar() {
  const { user } = useUser();
  const { role } = useRole();
  const currentLocation = useLocation();
  
  const enlacesPorRol = {
    Asociado: [
      { ruta: '/asociado/dashboard', texto: 'Inicio' },
      { ruta: '/asociado/perfil', texto: 'Mi Perfil' },
      { ruta: '/asociado/libro-vuelo', texto: 'Libro de Vuelo' },
      { ruta: '/asociado/cuenta-corriente', texto: 'Cuenta Corriente' },
      { ruta: '/asociado/aeronaves', texto: 'Aeronaves' },
      { ruta: '/asociado/tarifas', texto: 'Tarifas' },
      { ruta: '/logout', texto: 'Cerrar Sesión', logout: true },
    ],
    Gestor: [
      { ruta: '/gestor/dashboard', texto: 'Inicio' },
      { ruta: '/gestor/recibos', texto: 'Recibos' },
      { ruta: '/gestor/vuelos', texto: 'Vuelos' },
      { ruta: '/gestor/cuenta-corriente', texto: 'Cuenta Corriente Aeroclub' },
      { ruta: '/gestor/asociados', texto: 'Asociados' },
      { ruta: '/gestor/tarifas', texto: 'Tarifas' },
      { ruta: '/gestor/aeronaves', texto: 'Aeronaves' },
      { ruta: '/logout', texto: 'Cerrar Sesión', logout: true },
    ],
    Instructor: [
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

  const enlaces = enlacesPorRol[role] || [];

  return (
    <div className={`sidebar-container `}>
      <div className="sidebar-header">
        <div className="sidebar-header-info">
          <span>{user?.name || 'ApellidoNombre'}</span>
          <hr className="divisor-header"/>
          {role.toUpperCase()}
        </div>
      </div>
       <BotonesPorRol  />
       <div className={`sidebar-navbar`}>
         {enlaces.map((enlace, index) => (
           <Boton
             key={index}
             estilos={`sidebar-navbar-link ${
              currentLocation.pathname === enlace.ruta ? 'active' : ''
            }`}
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