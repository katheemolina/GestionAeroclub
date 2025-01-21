import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDatosDelUsuario } from "../services/usuariosApi";
import { useUser } from "../context/UserContext"; // Importar el contexto del usuario
import "../styles/background.css";
import { Dialog } from "primereact/dialog";
import "../styles/bienvenida.css";

function Bienvenida() {
  const [mostrarDialogo, setMostrarDialogo] = useState(false); // Estado para controlar la visibilidad
  const [usuario, setUsuario] = useState({}); // Estado para almacenar los datos del usuario
  const { usuarioId } = useUser(); // Obtener usuarioId desde el contexto
  const navigate = useNavigate();

  useEffect(() => {
    const verificarDni = async () => {
      try {
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId); // Usar usuarioId del contexto
        const usuarioData = usuarioResponse[0];
        setUsuario(usuarioData); // Guardar los datos del usuario en el estado
        setMostrarDialogo(!usuarioData.dni); // Mostrar el diálogo si no hay DNI
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (usuarioId) {
      verificarDni(); // Llamar a la función solo si hay un usuarioId disponible
    }
  }, [usuarioId]);

  const redirigirCargaDatos = () => {
    setMostrarDialogo(false); // Cierra el diálogo antes de redirigir
    navigate("/asociado/perfil"); // Cambia al path que apunta a AsociadoPerfil.js
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
          Selecciona tu rol para acceder a las funcionalidades correspondientes. Si no aparece a la derecha, recarga la página.
        </p>
      </div>
    </div>
  );
}

export default Bienvenida;
