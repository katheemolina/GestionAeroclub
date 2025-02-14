import Boton from "./Button";
import "./styles/usuarioDeshabilitado.css"
import react from 'react';
export default function UsuarioDeshabilitado() {


  return (
    <div className="usuario-deshabilitado">
      <div className="disabled-container">
        <h1 className="disabled-title">Usuario Deshabilitado</h1>
        <p className="disabled-message">
        Por favor, contáctese con algún integrante de la Comisión Directiva para obtener ayuda.
        </p>
        <Boton
             estilos={`disabled-button `}
             texto={'Salir'}
             logout={true}
           />
      </div>
    </div>
  );
}   
