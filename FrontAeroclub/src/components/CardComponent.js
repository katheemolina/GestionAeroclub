import React from "react";
import "./styles/CardComponent.css"; // Opcional: puedes agregar estilos personalizados

const CardComponent = ({ title, subtitle, image, content }) => {
  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {subtitle && <h5 className="card-subtitle">{subtitle}</h5>}
        <p className="card-content">{content}</p>
      </div>
    </div>
  );
};

export default CardComponent;
