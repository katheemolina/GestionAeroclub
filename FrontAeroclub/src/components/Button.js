import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

//Componente botón generico que puede usarse para desloguarse del sistema
function Boton({ texto, ruta, estilos, logout }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleClick = () => {
    if (logout) {
      // Si logout es true, remuevo al usuario del LS y navego a la pagina del login
      setUser(null);
      localStorage.removeItem('user');
      navigate('/'); 
    } else if (ruta) {
    // Si no es logout, entonces es para navegar (por ahora)
      navigate(ruta);
    }
  };

  return (
    <button onClick={handleClick} className={estilos}>
      {texto}
    </button>
  );
}

export default Boton;
