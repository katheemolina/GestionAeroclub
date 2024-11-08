import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent'; // Asegúrate de importar el componente de tarjeta
import "./Styles/AsociadoPerfil.css"
import { obtenerDatosDelUsuario,actualizarDatosDelUsuario  } from '../../services/usuariosApi';

function AsociadoPerfil({ idUsuario = 1 }) {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState([]);
  const [formData, setFormData] = useState({
    Telefono: '',
    Dni: '',
    Localidad: '',
    Direccion: '',
    FechaNacimiento: '',
    FechaVencCMA: '',
    Licencias: '',
    CantHorasVuelo: '',
    CantAterrizajes: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarioResponse = await obtenerDatosDelUsuario(idUsuario);
        setUsuario(usuarioResponse[0]);
        console.log(usuarioResponse);
        setFormData({
          Telefono: usuarioResponse[0].telefono || '',
          Dni: usuarioResponse[0].dni || '',
          Localidad: usuarioResponse[0].localidad || '',
          Direccion: usuarioResponse[0].direccion || '',
          FechaNacimiento: usuarioResponse[0].fecha_nacimiento?.split(" ")[0] || '',
          FechaVencCMA: usuarioResponse[0].fecha_vencimiento_CMA?.split(" ")[0] || '',
          Licencias: JSON.stringify(usuarioResponse[0].codigos_licencias) || '',
          CantHorasVuelo: parseFloat(usuarioResponse[0].cantidad_horas_vuelo) || '',
          CantAterrizajes: usuarioResponse[0].cantidad_aterrizajes || ''
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [idUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatosDelUsuario(idUsuario, formData);
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      alert("Error al actualizar datos");
    }
  };

  if (loading) {
    return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="background">
      <header className="header">
        <h1>Perfil</h1>
      </header>
      <CardComponent
        nombre={usuario.nombre || "Nombre no disponible"}
        apellido={usuario.apellido || "Apellido no disponible"}
        dni={usuario.dni || "No disponible"}
        localidad={usuario.localidad}
        direccion={usuario.direccion}
        telefono={usuario.telefono || "No disponible"}
        licencias={usuario.codigos_licencias || ["ejemplo"]}
      />
      <form className="edit-form" onSubmit={handleSubmit}>
        <h2>Editar información:</h2>
        <div className="form-row">
          <label>
            Teléfono:
            <input
              type="tel"
              name="Telefono"
              placeholder="Teléfono"
              value={formData.Telefono}
              onChange={handleChange}
            />
          </label>
          <label>
            DNI:
            <input
              type="text"
              name="Dni"
              placeholder="DNI"
              value={formData.Dni}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Localidad:
            <input
              type="text"
              name="Localidad"
              placeholder="Localidad"
              value={formData.Localidad}
              onChange={handleChange}
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="Direccion"
              placeholder="Dirección"
              value={formData.Direccion}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Fecha de Nacimiento:
            <input
              type="date"
              name="FechaNacimiento"
              value={formData.FechaNacimiento}
              onChange={handleChange}
            />
          </label>
          <label>
            Fecha Vencimiento CMA:
            {console.log(formData)}
            <input
              type="date"
              name="FechaVencCMA"
              value={formData.FechaVencCMA}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Cantidad de Horas de Vuelo:
            <input
              type="number"
              name="CantHorasVuelo"
              placeholder="Horas de Vuelo"
              value={formData.CantHorasVuelo}
              onChange={handleChange}
            />
          </label>
          <label>
            Cantidad de Aterrizajes:
            <input
              type="number"
              name="CantAterrizajes"
              placeholder="Aterrizajes"
              value={formData.CantAterrizajes}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="button-container">
          <button type="submit">Guardar Cambios</button>
        </div>
      </form>
      </div>
  );
}

export default AsociadoPerfil;