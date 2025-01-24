import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import { useLocation } from 'react-router-dom';
import { FaHome, FaUserAlt, FaBook, FaCreditCard, FaPlane, FaCog ,FaDollarSign, FaMoneyBillWave ,FaRegAddressBook ,FaRegCalendarCheck ,FaUserFriends  ,FaBell  } from 'react-icons/fa'; // Importando íconos
import Boton from './Button';
import BotonesPorRol from './RolesBnts';
import '../styles/sidebar.css';
import Tooltip from '@mui/material/Tooltip';

function Sidebar() {
  const { user } = useUser();
  const { role } = useRole();
  const currentLocation = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  
  const enlacesPorRol = {
    Asociado: [
      { ruta: '/asociado/dashboard', texto: 'Inicio', icon: <FaHome /> },
      { ruta: '/asociado/perfil', texto: 'Mi Perfil', icon: <FaUserAlt /> },
      { ruta: '/asociado/libro-vuelo', texto: 'Libro de Vuelo', icon: <FaBook /> },
      { ruta: '/asociado/cuenta-corriente', texto: 'Cuenta Corriente', icon: <FaCreditCard /> },
      { ruta: '/asociado/aeronaves', texto: 'Aeronaves', icon: <FaPlane /> },
      { ruta: '/asociado/tarifas', texto: 'Tarifas', icon: <FaDollarSign /> },
     
    ],
    Gestor: [
      { ruta: '/gestor/dashboard', texto: 'Inicio', icon: <FaHome /> },
      { ruta: '/gestor/recibos', texto: 'Recibos', icon: <FaMoneyBillWave    /> },
      { ruta: '/gestor/vuelos', texto: 'Libro de Vuelo', icon: <FaBook /> },
      { ruta: '/gestor/cuenta-corriente', texto: 'Cuenta Corriente Aeroclub', icon: <FaCreditCard /> },
      { ruta: '/gestor/asociados', texto: 'Asociados', icon: <FaUserFriends   /> },
      { ruta: '/gestor/tarifas', texto: 'Tarifas', icon: <FaDollarSign /> },
      { ruta: '/gestor/aeronaves', texto: 'Aeronaves', icon: <FaPlane /> },
      { ruta: '/gestor/liquidarInstrucciones', texto: 'Liquidación para Instructores', icon: <FaCog /> },
      { ruta: '/gestor/generarCuotaSocial', texto: 'Generación de Cuotas Sociales', icon: <FaRegCalendarCheck  /> },
      { ruta: '/gestor/notificaciones', texto: 'Notificaciones', icon: <FaBell  /> },
    ],
    Instructor: [
      { ruta: '/instructor/dashboard', texto: 'Inicio', icon: <FaHome />},
      { ruta: '/instructor/perfil', texto: 'Mi Perfil', icon: <FaUserAlt />},
      { ruta: '/instructor/libro-vuelo', texto: 'Libro de Vuelo', icon: <FaBook />  },
      { ruta: '/instructor/cuenta-corriente', texto: 'Cuenta Corriente', icon: <FaCreditCard />  },
      { ruta: '/instructor/aeronaves',texto: 'Aeronaves', icon: <FaPlane />  },
      { ruta: '/instructor/tarifas', texto: 'Tarifas', icon: <FaDollarSign />},
      { ruta: '/instructor/asociados',  texto: 'Asociados', icon: <FaRegAddressBook  /> },
     
    ],
    Administrador: [
      { ruta: '/administrador/configuracionesGenerales', texto: 'Configuraciones generales' , icon: <FaCog />},
      { ruta: '/administrador/Recibos', texto: 'Recibos', icon: <FaMoneyBillWave /> },
      { ruta: '/administrador/Aeronaves', texto: 'Aeronaves', icon: <FaPlane />  },
    
    ],
  };

  const enlaces = enlacesPorRol[role] || [];

  const toggleLogout = () => {
    setShowLogout((prev) => !prev); // Alterna el estado para mostrar/ocultar el botón de logout
  };

  return (
    <div className={`sidebar-container `}>
      <div className="sidebar-header">
        <div className="sidebar-header-info">
          <span>{user?.name || 'ApellidoNombre'}</span>
          <hr className="divisor-header"/>
          <p>{role.toUpperCase()}</p>
        </div>
        <Tooltip title="Haz clic para cerrar sesión" arrow>
          <div
            className="sidebar-header-img-container"
            onClick={toggleLogout}
          >
            <img
              className="sidebar-header-img"
              src={user?.picture || '/path/to/default/image.jpg'}
              alt="foto de perfil"
            />
          </div>
        </Tooltip>
        {showLogout && (
          <div className="logout-button-container">
            <Boton
              texto="Cerrar Sesión"
              estilos="logout-button"
              logout={true}
            />
          </div>
        )}

      </div>
       <BotonesPorRol  />
       <div className={`sidebar-navbar`}>
         {enlaces.map((enlace, index) => (
           <Boton
           key={index}
           estilos={`sidebar-navbar-link ${currentLocation.pathname === enlace.ruta ? 'active' : ''}`}
           ruta={enlace.ruta}
           texto={enlace.texto}
           logout={enlace.logout || false}
           icon={enlace.icon} // Aquí pasas el ícono
           />
         ))}
       </div>
     </div>
  );
}

export default Sidebar;