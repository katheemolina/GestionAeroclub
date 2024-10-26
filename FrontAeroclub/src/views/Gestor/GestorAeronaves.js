import { apiAeronaves } from "../../services/apiAeronaves.ts";
import { useEffect, useState } from "react";
import React from 'react';

function GestorAeronaves() {
  const [aeronavesElements, setAeronavesElements] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchAeronaves() {
    setLoading(true);
    try {
      const aeronaves = await apiAeronaves.get();
      console.log(aeronaves); // Verifica la respuesta de la API

      // Verifica que la respuesta sea un arreglo
      if (!Array.isArray(aeronaves)) {
        throw new Error("Se esperaba un arreglo");
      }

      const elements = (
        <div className="mostrarAeronavesContainer">
          {aeronaves.map((aeronave) => (
            <article key={aeronave.id_aeronaves} id="tarjetaAeronave">
              <div className="nombreAeronave">
                <img alt="" />
                <div>
                  <h2>{aeronave.modelo}</h2>
                  <p>{aeronave.matricula}</p>
                </div>
                <div className="estado">
                  <h4 style={{ backgroundColor: backgroundColor(aeronave.estados_aeronaves_id) }}>
                    {estado(aeronave.estados_aeronaves_id)}
                  </h4>
                </div>
              </div>
            </article>
          ))}
        </div>
      );

      setAeronavesElements(elements);
    } catch (error) {
      console.error("Error al cargar aeronaves:", error);
      setAeronavesElements(<div>Error al cargar aeronaves</div>); // Manejo del estado de error
    } finally {
      setLoading(false);
    }
  }

  function estado(estadoId) {
    switch (estadoId) {
      case 1:
        return "Habilitado";
      case 2:
        return "Deshabilitado";
      case 3:
        return "En mantenimiento";
      case 4:
        return "Fuera de servicio";
      default:
        return "Desconocido";
    }
  }

  function backgroundColor(estadoId) {
    switch (estadoId) {
      case 1:
        return "var(--verdeSemaforo)";
      case 2:
        return "var(--rojoSemaforo)";
      case 3:
        return "var(--amarilloSemaforo)";
      case 4:
        return "var(--gris)";
      default:
        return "var(--gris)";
    }
  }

  useEffect(() => {
    fetchAeronaves();
  }, []);

  return (
    <div className="content">
      <h1>Gestión de Aeronaves</h1>
      <div className="alertaAeronavesContainer">
        {loading ? <p>Cargando...</p> : aeronavesElements}
      </div>
    </div>
  );
}

export default GestorAeronaves;