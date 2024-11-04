import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent'; // Asegúrate de importar el componente de tarjeta
import "./Styles/InstructorPerfil.css"
import { obtenerDatosDelUsuario } from '../../services/usuariosApi';


function InstructorPerfil({ idUsuario = 1 }) {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const usuarioResponse = await obtenerDatosDelUsuario(idUsuario);
      setUsuario(usuarioResponse[0]);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
    setLoading(false); // Cambia el estado de carga
  };
    fetchData();
  }, [idUsuario]);


  if (loading) {
    return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="background">
      <header className="header">
        <h1>Perfil</h1>
      </header>
      <CardComponent
        nombre={usuario.nombre}
        dni={usuario.dni}
        apellido={usuario.apellido}
        localidad={usuario.localidad}
        direccion={usuario.direccion}
        telefono={usuario.telefono}
        licencias={usuario.codigos_licencias}
        content={
          <>
            <p>Email: {usuario.email}</p>
            <p>Vencimiento CMA: {usuario.cmaVencimiento}</p>
          </>
        }
      />
      <form className="edit-form">
      <h2>Editar información:</h2>
       {console.log(usuario)}
        <div className="form-row">
          <label>
            Nombre:
            <input type="text" placeholder="Nombre" value={usuario.nombre}/>
          </label>
          <label>
            Apellido:
            <input type="text" placeholder="Apellido" value={usuario.apellido} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Localidad:
            <input type="text" placeholder="Localidad" value={usuario.localidad}/>
          </label>
          <label>
            Dirección:
            <input type="text" placeholder="Dirección" value={usuario.direccion}/>
          </label>
        </div>
        <div className="form-row">
          <label>
            Teléfono:
            <input type="tel" placeholder="Teléfono" value={usuario.telefono}/>
          </label>
        </div>
        <div className="button-container">
          <button type="submit">Editar</button>
        </div>
      </form>
    </div>
  );
}

export default InstructorPerfil;
