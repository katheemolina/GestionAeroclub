import React from 'react';
import CardComponent from '../../components/CardComponent'; // Asegúrate de importar el componente de tarjeta
import "./Styles/AsociadoPerfil.css"
import "../../styles/background.css"


function AsociadoPerfil() {
  const usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    cmaVencimiento: '2024-12-01',
    // Si deseas incluir una imagen de perfil, puedes agregar una propiedad aquí
    // imagen: 'url_de_la_imagen'
  };

  return (
    <div className="background">
      <h1>Perfil</h1>
      <CardComponent
        title={usuario.nombre}
        subtitle="Información de Usuario"
        content={
          <>
            <p>Email: {usuario.email}</p>
            <p>Vencimiento CMA: {usuario.cmaVencimiento}</p>
          </>
        }
        // Si tienes una imagen de perfil, descomenta la siguiente línea
        // image={usuario.imagen}
      />
      <form className="edit-form">
      <h2>Editar información:</h2>
        <div className="form-row">
          <label>
            Nombre:
            <input type="text" placeholder="Nombre" />
          </label>
          <label>
            Apellido:
            <input type="text" placeholder="Apellido" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Localidad:
            <input type="text" placeholder="Localidad" />
          </label>
          <label>
            Dirección:
            <input type="text" placeholder="Dirección" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Teléfono:
            <input type="tel" placeholder="Teléfono" />
          </label>
        </div>
        <div className="button-container">
          <button type="submit">Editar</button>
        </div>
      </form>
    </div>
  );
}

export default AsociadoPerfil;
