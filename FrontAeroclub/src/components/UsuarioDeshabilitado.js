import "./styles/usuarioDeshabilitado.css"
import react from 'react';
export default function UsuarioDeshabilitado() {


  return (
    <div className="usuario-deshabilitado">
      <div className="disabled-container">
        <h1 className="disabled-title">Usuario Deshabilitado</h1>
        <p className="disabled-message">
          Lo sentimos, su cuenta de usuario está actualmente deshabilitada. Por favor, contacte con un administrador para obtener ayuda.
        </p>
        <a href="mailto:admin@example.com" className="disabled-button">
          Contactar Administrador
        </a>
      </div>
    </div>
  );
}   
