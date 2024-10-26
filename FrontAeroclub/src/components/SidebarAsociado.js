import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'

import { useRole } from '../context/RoleContext';

function SidebarAsociado() {
  const  {role}  = useRole();
  return (
    <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-header-img"></div>
          <div className="sidebar-header-info">
              <span>Nombre Apellido</span>
              <hr/>
              <span>Licencia - {role} </span>
          </div>
        </div>
        <div className="sidebar-navbar">
            <Link className="sidebar-navbar-link" to="/asociado/dashboard">Inicio</Link>
            <Link className="sidebar-navbar-link" to="/asociado/perfil">Mi Perfil</Link>
            <Link className="sidebar-navbar-link" to="/asociado/libro-vuelo">Libro de Vuelo</Link>
            <Link className="sidebar-navbar-link" to="/asociado/cuenta-corriente">Cuenta Corriente</Link>
        </div>
    </div>
  );
}

export default SidebarAsociado;