import React from 'react';
import { Link } from 'react-router-dom';
import { useUser} from '../context/UserContext'
import { useRole } from '../context/RoleContext';

function SidebarGestor() {
  const { user } = useUser()
  const  {role}  = useRole();
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-header-img"></div>
        <div className="sidebar-header-info">
          <span>{user ? user.name :"ApellidoNombre"}</span>
          <hr/>
          <span>Licencia - {role} </span>
        </div>
      </div>
      <div className="sidebar-navbar">
        <Link className="sidebar-navbar-link" to="/gestor/dashboard">Inicio</Link>
        <Link className="sidebar-navbar-link" to="/gestor/vuelos">Vuelos</Link>
        <Link className="sidebar-navbar-link" to="/gestor/cuenta-corriente">Cuenta Corriente</Link>
        <Link className="sidebar-navbar-link" to="/gestor/asociados">Asociados</Link>
        <Link className="sidebar-navbar-link" to="/gestor/tarifas">Tarifas</Link>
        <Link className="sidebar-navbar-link" to="/gestor/aeronaves">Aeronaves</Link>
      </div>
    </div>
  );
}

export default SidebarGestor;
