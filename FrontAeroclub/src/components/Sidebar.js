import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import Boton from './Button';
import BotonesPorRol from './RolesBnts';
import '../styles/sidebar.css';

function Sidebar() {
  const { user } = useUser();
  const { role } = useRole();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Usamos un estado para el tamaño de la ventana

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
      { ruta: '/gestor/cuenta-corriente', texto: 'Todos Los Movimientos' },
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

  // Alternar visibilidad completa solo en móviles
  const toggleSidebar = () => {
    if (isMobile) { // Solo permite expandir en móviles
      setIsExpanded(!isExpanded);
    }
  };

  // Detectar cambio en el tamaño de la ventana (por ejemplo, cuando se pasa a escritorio o móvil)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manejar el clic en cualquier enlace para cerrar el sidebar en móviles
  const handleLinkClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`sidebar-container ${isExpanded ? 'full-screen' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-info">
          <span>{user?.name || 'ApellidoNombre'}</span>
          <hr className="divisor-header"/>
          {role.toUpperCase()}
        </div>
        {isMobile && (
          <div className="toggle-arrow" onClick={toggleSidebar}>
            {isExpanded ? '▲' : '▼'}
          </div>
        )}
      </div>
       <BotonesPorRol  />
       <div className={`sidebar-navbar ${isExpanded ? 'show' : ''}`}>
         {enlaces.map((enlace, index) => (
           <Boton
             key={index}
             estilos="sidebar-navbar-link"
             ruta={enlace.ruta}
             texto={enlace.texto}
             logout={enlace.logout || false}
             onClick={handleLinkClick} // Llamamos a handleLinkClick al hacer clic
           />
         ))}
       </div>
     </div>
  );
}

export default Sidebar;