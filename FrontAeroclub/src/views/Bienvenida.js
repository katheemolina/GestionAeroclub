import "../styles/background.css"
import "../styles/bienvenida.css"

function Bienvenida() {
return (
    <div className="background">
        <div className="titulo-btn">
            <div className="contenedor-titulo">
                <p className="titulo-bienvenida">¡Bienvenido al Sistema de Gestión de Aeroclubes!</p>
            </div>
        </div>
        <img className="foto-bienvenida" src='https://storage.googleapis.com/diariodemocracia/cache/fa/ac/Se-firmo-un-acuerdo-para-que-la-Escuela-tecnica-de-Lincoln-fabique-un-avion-5fff23.jpg    '/>
        <div className="cuerpo">
            <p className="texto-guia">Selecciona tu rol para acceder a las funcionalidades correspondientes, en el caso que no aparezca a la derecha, por favor recarga la pagina.</p> 
        </div>
    </div>
  );
}

export default Bienvenida;