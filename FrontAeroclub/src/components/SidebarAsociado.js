import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'
import { useUser} from '../context/UserContext'
import { useRole } from '../context/RoleContext';
import Boton from './Button';
import BotonesPorRol from './RolesBnts';

function SidebarAsociado() {
  const { user } = useUser()
  const  {role}  = useRole();

  const rolUsuario = "asociado"; // Puede ser "admin", "user", "guest", etc.
  return (
    <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-header-info">
              <span>{user ? user.name :"ApellidoNombre"}</span>
              <hr/>
              <span>Licencia - {role} </span>
          </div>
          <BotonesPorRol rol={rolUsuario} />      
        </div>
        <div className="sidebar-navbar">
            <Boton estilos="sidebar-navbar-link" ruta="/asociado/dashboard" texto="Inicio"/>
            <Boton estilos="sidebar-navbar-link" ruta="/asociado/perfil" texto="Mi Perfil"/>
            <Boton estilos="sidebar-navbar-link" ruta="/asociado/libro-vuelo" texto="Libro de Vuelo"/>
            <Boton estilos="sidebar-navbar-link" ruta="/asociado/cuenta-corriente" texto="Cuenta Corriente"/>
            <Boton estilos="sidebar-navbar-link" texto="Cerrar Sesion" logout={true}/>
        </div>
    </div>
  );
}

export default SidebarAsociado;