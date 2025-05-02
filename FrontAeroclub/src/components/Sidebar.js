import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import { useLocation } from 'react-router-dom';
import { 
  FaHome, FaUserAlt, FaBook, FaCreditCard, FaPlane, FaCog,
  FaDollarSign, FaMoneyBillWave, FaRegAddressBook, FaRegCalendarCheck,
  FaUserFriends, FaUsersCog
} from 'react-icons/fa';
import Boton from './Button';
import BotonesPorRol from './RolesBnts';
import '../styles/sidebar.css';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar() {
  const { user, PerfilIncompleto } = useUser();
  const { role } = useRole();
  const currentLocation = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const enlacesPorRol = {
    Asociado: [
      { ruta: '/asociado/dashboard', texto: 'Inicio', icon: <FaHome />, completarPerfil: false },
      { ruta: '/asociado/perfil', texto: 'Mi Perfil', icon: <FaUserAlt />, completarPerfil: true },
      { ruta: '/asociado/libro-vuelo', texto: 'Libro de Vuelo', icon: <FaBook />, completarPerfil: false },
      { ruta: '/asociado/cuenta-corriente', texto: 'Cuenta Corriente', icon: <FaCreditCard />, completarPerfil: false },
      { ruta: '/asociado/aeronaves', texto: 'Aeronaves', icon: <FaPlane />, completarPerfil: false },
      { ruta: '/asociado/tarifas', texto: 'Tarifas', icon: <FaDollarSign />, completarPerfil: false },
    ],
    Gestor: [
      { ruta: '/gestor/dashboard', texto: 'Inicio', icon: <FaHome />, completarPerfil: true },
      { ruta: '/gestor/recibos', texto: 'Recibos', icon: <FaMoneyBillWave />, completarPerfil: true },
      { ruta: '/gestor/vuelos', texto: 'Libro de Vuelo', icon: <FaBook />, completarPerfil: true },
      { ruta: '/gestor/cuenta-corriente', texto: 'Cuenta Corriente Aeroclub', icon: <FaCreditCard />, completarPerfil: true },
      { ruta: '/gestor/asociados', texto: 'Asociados', icon: <FaUserFriends />, completarPerfil: true },
      { ruta: '/gestor/instructores', texto: 'Instructores', icon: <FaUsersCog />, completarPerfil: true },
      { ruta: '/gestor/tarifas', texto: 'Tarifas', icon: <FaDollarSign />, completarPerfil: true },
      { ruta: '/gestor/aeronaves', texto: 'Aeronaves', icon: <FaPlane />, completarPerfil: true },
      { ruta: '/gestor/liquidarInstrucciones', texto: 'Liquidación para Instructores', icon: <FaCog />, completarPerfil: true },
      { ruta: '/gestor/generarCuotaSocial', texto: 'Generación de Cuotas Sociales', icon: <FaRegCalendarCheck />, completarPerfil: true },
    ],
    Instructor: [
      { ruta: '/instructor/dashboard', texto: 'Inicio', icon: <FaHome />, completarPerfil: false },
      { ruta: '/instructor/perfil', texto: 'Mi Perfil', icon: <FaUserAlt />, completarPerfil: true },
      { ruta: '/instructor/libro-vuelo', texto: 'Libro de Vuelo', icon: <FaBook />, completarPerfil: false },
      { ruta: '/instructor/cuenta-corriente', texto: 'Cuenta Corriente', icon: <FaCreditCard />, completarPerfil: false },
      { ruta: '/instructor/aeronaves', texto: 'Aeronaves', icon: <FaPlane />, completarPerfil: false },
      { ruta: '/instructor/tarifas', texto: 'Tarifas', icon: <FaDollarSign />, completarPerfil: false },
      { ruta: '/instructor/asociados', texto: 'Asociados', icon: <FaRegAddressBook />, completarPerfil: false },
    ],
    Administrador: [
      { ruta: '/administrador/configuracionesGenerales', texto: 'Configuraciones generales', icon: <FaCog /> },
      { ruta: '/administrador/Recibos', texto: 'Recibos', icon: <FaMoneyBillWave /> },
      { ruta: '/administrador/Aeronaves', texto: 'Aeronaves', icon: <FaPlane /> },
    ],
  };

  const enlaces = enlacesPorRol[role] || [];

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };


  if (!localStorage.getItem('role')) {
    return (
      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-header-info">
            <span>{user?.name || 'ApellidoNombre'}</span>
            <hr className="divisor-header" />
            <p>Selecciona un rol</p>
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
        </div>
        {showLogout && (
          <div className='logout-container'>
            <Boton
              icon={<LogoutIcon />}
              texto="Cerrar Sesión"
              estilos="logout-button"
              logout={true}
            />
          </div>
        )}
        <BotonesPorRol />
        <div className="sidebar-navbar">
          <p style={{ padding: '1rem', color: '#888' }}>Esperando que selecciones un rol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-header-info">
          <span>{user?.name || 'ApellidoNombre'}</span>
          <hr className="divisor-header" />
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
      </div>

      {showLogout && (
        <div className='logout-container'>
          <Boton
            icon={<LogoutIcon />}
            texto="Cerrar Sesión"
            estilos="logout-button"
            logout={true}
          />
        </div>
      )}

      <BotonesPorRol />

      <div className="sidebar-navbar">
        {enlaces
          .filter(enlace => !PerfilIncompleto ? enlace.completarPerfil : true)
          .map((enlace, index) => (
            <Boton
              key={index}
              estilos={`sidebar-navbar-link ${currentLocation.pathname === enlace.ruta ? 'active' : ''}`}
              ruta={enlace.ruta}
              texto={enlace.texto}
              logout={enlace.logout || false}
              icon={enlace.icon}
            />
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
