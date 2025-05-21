import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Dialog } from 'primereact/dialog';

import { useState } from 'react';
import { Button } from 'primereact/button';
import './styles/DialogConfirmacion.css';

function Boton({ texto, ruta, estilos, logout, icon }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleClick = () => {
    if (logout) {
      // Si logout es true, remuevo al usuario del LS y navego a la pagina del login
      setLogoutDialog(true);
      //setUser(null);
      //localStorage.removeItem('user');
      //localStorage.removeItem('role');
      //navigate('/InicioSesion'); 
    } else if (ruta) {
      // Si no es logout, entonces es para navegar (por ahora)
      navigate(ruta);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/InicioSesion'); 
  }

  return (
    <>
      <button onClick={handleClick} className={estilos}>
        {icon && <span className="icon">{icon}</span>} {/* Aquí se muestra el ícono */}
        {texto}
      </button>

      <Dialog
        className='dialogConfirmar'
        header={'Confirmar'}
        visible={logoutDialog}
        onHide={() => {
          logout=false;
          setLogoutDialog(false);
        }}
        style={{ width: '400px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
              <Button className='gestor-btn-confirmar' label="Cancelar" icon="pi pi-times" onClick={() => setLogoutDialog(false)}/>
              <Button className='p-button-secondary gestor-btn-cancelar' style={{marginRight: '0'}} label="Cerrar sesión" icon="pi pi-check" onClick={handleLogout}/>
          </div>
        }>
        <p>¿Está seguro que desea <b>cerrar sesión</b>?</p>
      </Dialog>
    </>
  );
}

export default Boton;
