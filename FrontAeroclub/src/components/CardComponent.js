import React from "react";
import "./styles/CardComponent.css"; // Opcional: puedes agregar estilos personalizados

const CardComponent = ({ nombre, apellido, dni, localidad, direccion, telefono, licencias }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{nombre} {apellido}</h3>
        <p className="card-subtitle">{dni}</p>
        <p className="card-subtitle">{localidad}, {direccion}</p>
        <p className="card-subtitle">{telefono}</p>
        <p className="card-subtitle">{licencias}</p>
      </div>
    </div>
  );
};

export default CardComponent;
