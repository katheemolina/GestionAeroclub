import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent'; 
import "./Styles/AsociadoPerfil.css"
import { obtenerDatosDelUsuario,actualizarDatosDelUsuario ,obtenerLicenciasPorUsuario, actualizarLicencias} from '../../services/usuariosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import PantallaCarga from '../../components/PantallaCarga';
import 'react-toastify/dist/ReactToastify.css';

function AsociadoPerfil() {
  const [cargando, setCargando] = useState(true);
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

  const { usuarioId } = useUser();
  //Componente para licencias

  
  const [loading, setLoading] = useState(true);
  const [licencias, setLicencias] = useState([]); 
  const [licenciaDialog, setLicenciaDialog] = useState(false); // Controla si el dialog está abierto
  const [selectedLicencia, setSelectedLicencia] = useState(null); // Almacena la licencia seleccionada
  const [fechaVencimiento, setFechaVencimiento] = useState(null); // Almacena la fecha de vencimiento
  const [tiposLicencias] = useState([
    { label: 'Piloto de planeador', value: 'Piloto de planeador' },
    { label: 'Piloto privado', value: 'Piloto privado' },
    { label: 'Piloto comercial', value: 'Piloto comercial' },
    { label: 'Piloto de transporte de línea aérea', value: 'Piloto de transporte de línea aérea' },
    { label: 'Instructor de vuelo', value: 'Instructor de vuelo' },
    { label: 'Piloto de ultraligero', value: 'Piloto de ultraligero' }
  ]);


  const fetchLicencias = async () => {
    try {
      const data = await obtenerLicenciasPorUsuario(usuarioId);
      setLicencias(data);
    } catch (error) {
      console.error('Error fetching licencias:', error);
    }
  };

  useEffect(() => {
    fetchLicencias();
    setLoading(false);
  }, []);

  const handleLicenciaUpdate = async () => {
    if (!selectedLicencia || !fechaVencimiento) {
      toast.warning("Por favor, seleccione una licencia y una fecha de vencimiento.");
      return;
    }

    try {
      const licenciaData = [
        { nombreLic: selectedLicencia, fechaVenc: fechaVencimiento.toISOString().split('T')[0] }
      ];
      await actualizarLicencias(usuarioId, licenciaData); // Llamada a la API con los datos
      toast.success("Licencia actualizada correctamente.");
      setLicenciaDialog(false); // Cierra el diálogo después de la actualización
      fetchLicencias(); // Vuelve a cargar las licencias actualizadas
    } catch (error) {
      console.error("Error al actualizar licencia:", error);
      toast.error("Error al actualizar licencia.");
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
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
      setCargando(false);
    };
    fetchData();
  }, [usuarioId]);


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
      await actualizarDatosDelUsuario(usuarioId, formData);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      toast.error("Error al actualizar datos");
    }
  };

  const formatFecha = (rowData) => {
    // Extrae solo la fecha de 'fecha_vencimiento' (sin hora)
    const fecha = new Date(rowData.fecha_vencimiento).toLocaleDateString();
    return fecha;
  };

  const calcularEstadoLicencia = (rowData) => {
    const fechaVencimiento = new Date(rowData.fecha_vencimiento);
    const hoy = new Date();
    const diferenciaDias = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias > 30) {
      return "Vigente";
    } else if (diferenciaDias >= 0 && diferenciaDias <= 30) {
      return "Actualizar licencia";
    } else {
      return "Licencia vencida";
    }
  };


  if (cargando) {
    return <PantallaCarga/>
  }
  return (
    <div className="background">
      <ToastContainer />
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
        <h2>Datos historicos:</h2>
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

      <section className="licencias-section">
        <h3>Licencias</h3>
        <DataTable 
          value={licencias} 
          style={{ width: '100%' }} >
          <Column field="codigos_licencias" header="Codigos de licencias"></Column>
          <Column field="descripcion" header="Descripcion"></Column>
          <Column field="fecha_vencimiento" header="Fecha de vencimiento" body={formatFecha} /> 
          <Column header="Estado" body={calcularEstadoLicencia} />
        </DataTable>
        <Button label="Actualizar licencias" icon="pi pi-refresh" id="actualizar-licencias" onClick={() => setLicenciaDialog(true)} />
      
      </section>
      
      <Dialog
        header="Actualizar Licencia"
        visible={licenciaDialog}
        onHide={() => setLicenciaDialog(false)}
        style={{ width: '50vw' }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="tipoLicencia">Tipo de Licencia</label>
            <Dropdown
              id="tipoLicencia"
              value={selectedLicencia}
              options={tiposLicencias}
              onChange={(e) => setSelectedLicencia(e.value)}
              placeholder="Seleccione una licencia"
            />
          </div>
          <div className="p-field">
            <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
            <Calendar
              id="fechaVencimiento"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.value)}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="button-container">
            <Button label="Actualizar" icon="pi pi-check" onClick={handleLicenciaUpdate} />
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setLicenciaDialog(false)} className="p-button-secondary" />
          </div>
        </div>
      </Dialog>

      </div>
  );
}

export default AsociadoPerfil;