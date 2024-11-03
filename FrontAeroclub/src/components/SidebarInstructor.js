import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'
import { useRole } from '../context/RoleContext';
import { useUser } from '../context/UserContext';
import Boton from './Button';


function SidebarInstructor() {
  const  {role}  = useRole();
  const  {user}  = useUser();
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
            <Boton estilos="sidebar-navbar-link" ruta="/instructor/dashboard" texto="Inicio"/>
            <Boton estilos="sidebar-navbar-link" ruta="/instructor/perfil" texto="Mi Perfil"/>
            <Boton estilos="sidebar-navbar-link" ruta="/instructor/libro-vuelo" texto="Libro de Vuelo"/>
            <Boton estilos="sidebar-navbar-link" ruta="/instructor/cuenta-corriente" texto="Cuenta Corriente"/>
            <Boton estilos="sidebar-navbar-link" ruta="/instructor/asociados" texto="Asociados"/>
            <Boton estilos="sidebar-navbar-link" texto="Cerrar Sesion" logout={true}/>
        </div>
    </div>
  );
}

export default SidebarInstructor;