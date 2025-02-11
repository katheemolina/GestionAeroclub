import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDatosDelUsuario } from "../services/usuariosApi";
import { useUser } from "../context/UserContext"; // Importar el contexto del usuario
import "../styles/background.css";
import { Dialog } from "primereact/dialog";
import "../styles/bienvenida.css";
import { useRole } from "../context/RoleContext";
import { toast } from "react-toastify";

function Bienvenida() {
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [usuario, setUsuario] = useState({});
  const { usuarioId } = useUser();
  const navigate = useNavigate();

  
  const [rol, setRol] = useState(() => localStorage.getItem("role")?.toLowerCase());

  
  useEffect(() => {
    const verificarCambioDeRol = () => {
      const nuevoRol = localStorage.getItem("role")?.toLowerCase();
      if (nuevoRol !== rol) {
        setRol(nuevoRol);
      }
    };

    
    window.addEventListener("storage", verificarCambioDeRol);

    
    const interval = setInterval(verificarCambioDeRol, 500);

    return () => {
      window.removeEventListener("storage", verificarCambioDeRol);
      clearInterval(interval);
    };
  }, [rol]);

  useEffect(() => {
    const verificarDni = async () => {
      try {
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
        const usuarioData = usuarioResponse[0];
        setUsuario(usuarioData);

        if (!usuarioData.dni && (rol === "asociado" || rol === "instructor")) {
          setMostrarDialogo(true);
        } else {
          setMostrarDialogo(false);
        }
      } catch (error) {
        toast.error("Error al obtener datos del usuario:", error);
      }
    };

    if (usuarioId && rol) {
      verificarDni();
    }
  }, [usuarioId, rol]);

  const redirigirCargaDatos = () => {
    setMostrarDialogo(false);
    navigate(`/${rol}/perfil`);
  };

  return (
    <div className="background">
      <div className="titulo-btn">
        <div className="contenedor-titulo">
          <p className="titulo-bienvenida">¡Bienvenido al Sistema de Gestión de Aeroclubes!</p>
        </div>
      </div>

      <Dialog
        visible={mostrarDialogo}
        onHide={() => setMostrarDialogo(false)} // Cerrar el diálogo al hacer clic fuera
        className="dialogo-cargar-datos"
        header={`Bienvenido ${usuario.nombre || ""} ${usuario.apellido || ""}`}
        closable={false} // Esto elimina la cruz de cierre predeterminada

      >
        
        <p className="texto-dialogo">Para comenzar, por favor ingresa tus datos iniciales.</p>
        <p className="texto-dialogo">Necesarias para gestionar el sistema.</p>

        <div className="button-container">
          <button className="btn-dialogo" onClick={redirigirCargaDatos}>
            Cargar datos
          </button>
        </div>
      </Dialog>

      <img
        className="foto-bienvenida"
        src="https://storage.googleapis.com/diariodemocracia/cache/fa/ac/Se-firmo-un-acuerdo-para-que-la-Escuela-tecnica-de-Lincoln-fabique-un-avion-5fff23.jpg"
        alt="Avión"
      />

      <div className="cuerpo">
        <p className="texto-guia">
          Selecciona tu rol para acceder a las funcionalidades correspondientes.
        </p>
      </div>
    </div>
  );
}

export default Bienvenida;


  
