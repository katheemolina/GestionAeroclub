import React, { useState } from 'react';
import './styles/FiltroComponent.css';

function FiltroComponent({ mostrarUsuario = true, mostrarFecha = true, onBuscar }) {
  const [usuario, setUsuario] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleBuscar = () => {
    // Ejecutar la función de búsqueda pasada como prop
    onBuscar({ usuario, fechaDesde, fechaHasta });
  };

  return (
    <div className="filtro-container">
      {/* Filtro por usuario */}
      {mostrarUsuario && (
        <div className="filtro-usuario">
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese el usuario"
          />
        </div>
      )}

      {/* Filtro por fecha */}
      {mostrarFecha && (
        <div className="filtro-fechas">
          <div className="fecha-campo">
            <label htmlFor="fechaDesde">Desde:</label>
            <input
              type="date"
              id="fechaDesde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <div className="fecha-campo">
            <label htmlFor="fechaHasta">Hasta:</label>
            <input
              type="date"
              id="fechaHasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Botón de búsqueda */}
      <div className="button-container">
        <button onClick={handleBuscar}>Buscar</button>
      </div>
    </div>
  );
}

export default FiltroComponent;
