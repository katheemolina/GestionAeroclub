import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Boton({ texto, ruta, estilos, logout, icon }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleClick = () => {
    if (logout) {
      // Si logout es true, remuevo al usuario del LS y navego a la pagina del login
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      navigate('/InicioSesion'); 
    } else if (ruta) {
      // Si no es logout, entonces es para navegar (por ahora)
      navigate(ruta);
    }
  };

  return (
    <button onClick={handleClick} className={estilos}>
      {icon && <span className="icon">{icon}</span>} {/* Aquí se muestra el ícono */}
      {texto}
    </button>
  );
}

export default Boton;
