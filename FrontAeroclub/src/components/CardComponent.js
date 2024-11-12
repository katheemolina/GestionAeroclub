import React from "react";
import "./styles/CardComponent.css"; // Opcional: puedes agregar estilos personalizados

const CardComponent = ({ nombre, apellido, dni, localidad, direccion,email, telefono, licencias,fecha_nacimiento }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{nombre} {apellido}</h3>
        <p className="card-subtitle">{dni}</p>
        <p className="card-subtitle">{localidad}, {direccion}</p>
        <p className="card-subtitle">{telefono}</p>
        <p className="card-subtitle">{email}</p>
        <p className="card-subtitle">{licencias}</p>
        <p className="card-subtitle">{fecha_nacimiento}</p>
      </div>
    </div>
  );
};

export default CardComponent;
