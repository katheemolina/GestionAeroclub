import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'
import { useUser} from '../context/UserContext'
import { useRole } from '../context/RoleContext';
import Boton from './Button';

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
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/dashboard" texto="Inicio"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/recibos" texto="Recibos"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/vuelos" texto="Vuelos"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/cuenta-corriente" texto="Todos Los  Movimientos"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/asociados" texto="Asociados"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/tarifas" texto="Tarifas"/>
        <Boton estilos="sidebar-navbar-link" ruta="/gestor/aeronaves" texto="Aeronaves"/>
        <Boton estilos="sidebar-navbar-link" texto="Cerrar Sesion" logout={true}/>
      </div>
    </div>
  );
}

export default SidebarGestor;
