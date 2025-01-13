import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDatosDelUsuario } from "../services/usuariosApi";
import { useUser } from "../context/UserContext"; // Importar el contexto del usuario
import "../styles/background.css";
import "../styles/bienvenida.css";

function Bienvenida() {
  const [mostrarCajita, setMostrarCajita] = useState(false); // Estado para controlar la visibilidad
  const { usuarioId } = useUser(); // Obtener usuarioId desde el contexto
  const navigate = useNavigate();

  useEffect(() => {
    const verificarDni = async () => {
      try {
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId); // Usar usuarioId del contexto
        const usuario = usuarioResponse[0];
        setMostrarCajita(!usuario.dni); // Mostrar la cajita si no hay DNI
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (usuarioId) {
      verificarDni(); // Llamar a la función solo si hay un usuarioId disponible
    }
  }, [usuarioId]);

  const redirigirCargaDatos = () => {
    navigate("/asociado/perfil"); // Cambia al path que apunta a AsociadoPerfil.js
  };

  return (
    <div className="background">
      <div className="titulo-btn">
        <div className="contenedor-titulo">
          <p className="titulo-bienvenida">¡Bienvenido al Sistema de Gestión de Aeroclubes!</p>
        </div>
      </div>

      {mostrarCajita && ( // Renderizar condicionalmente la cajita
        <div className="cajita-cargar-datos">
          <p className="texto-cargar-datos">¿Nuevo en el sistema? Carga tus datos iniciales:</p>
          <button className="btn-cargar-datos" onClick={redirigirCargaDatos}>
            Cargar datos
          </button>
        </div>
      )}

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
