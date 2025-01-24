import React, { useState } from "react";
import "./Styles/GestorNotificaciones.css";

const GestorNotificaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: "Faltan 10hs de vuelo para realizar service a la aeronave XXXXX1", fecha: "2025-01-23T10:00:00Z" },
    { id: 2, mensaje: "El asociado Pepito Gómez no pagó la cuota social de octubre", fecha: "2025-01-22T14:30:00Z" },
    { id: 3, mensaje: "El asociado Carlos Gonzales debe actualizar su CMA", fecha: "2025-01-21T09:15:00Z" },
    { id: 4, mensaje: "El asociado Juana Viale tiene vencido su CMA", fecha: "2025-01-20T16:45:00Z" },
    { id: 5, mensaje: "El asociado Marcelo Tinelli pronto perderá su adaptación a la nave XXXX2", fecha: "2025-01-19T12:20:00Z" },
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredNotificaciones = notificaciones.filter((noti) =>
    noti.mensaje.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="background">
      <h1 style={{ textAlign: "left", fontSize: "36px" }}>Notificaciones</h1>

      <input
        type="text"
        placeholder="Buscar notificaciones..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="notificaciones-list">
        {filteredNotificaciones.length > 0 ? (
          filteredNotificaciones.map((noti) => (
            <div className="notificacion" style={{ textAlign: "left" }}>
  <p className="mensaje" style={{ textAlign: "left" }}>{noti.mensaje}</p>
  <p className="fecha" style={{ textAlign: "left" }}>{new Date(noti.fecha).toLocaleString()}</p>
</div>

          ))
        ) : (
          <p className="no-results">No se encontraron notificaciones.</p>
        )}
      </div>
    </div>
  );
};

export default GestorNotificaciones;
