import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';



function SidebarInstructor() {
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
            <Link className="sidebar-navbar-link" to="/instructor/dashboard">Inicio</Link>
            <Link className="sidebar-navbar-link" to="/instructor/perfil">Mi Perfil</Link>
            <Link className="sidebar-navbar-link" to="/instructor/libro-vuelo">Libro de Vuelo</Link>
            <Link className="sidebar-navbar-link" to="/instructor/cuenta-corriente">Cuenta Corriente</Link>
            <Link className="sidebar-navbar-link" to="/instructor/asociados">Asociados</Link>
        </div>
    </div>
  );
}

export default SidebarInstructor;