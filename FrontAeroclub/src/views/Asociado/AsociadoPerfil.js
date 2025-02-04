import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent'; 
import UploadImage from '../../components/UploadImage'; 
import "./Styles/AsociadoPerfil.css"
import { obtenerDatosDelUsuario,actualizarDatosDelUsuario ,obtenerLicenciasPorUsuario, actualizarLicencias} from '../../services/usuariosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useUser } from '../../context/UserContext';
import { useRole } from '../../context/RoleContext.js'; // Para obtener el rol del usuario
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import PantallaCarga from '../../components/PantallaCarga';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/datepicker.css'
import {FaDollarSign} from 'react-icons/fa'; // Importando íconos


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
  const { role } = useRole(); // Obtener el rol del usuario desde RoleContext

  //Componente para licencias
  

  const [loading, setLoading] = useState(true);
  const [licencias, setLicencias] = useState([]); 
  const [licenciaDialog, setLicenciaDialog] = useState(false); // Controla si el dialog está abierto
  const [selectedLicencia, setSelectedLicencia] = useState(null); // Almacena la licencia seleccionada
  const [fechaVencimiento, setFechaVencimiento] = useState(null); // Almacena la fecha de vencimiento
  const [editado, setEditado] = useState(false);
  const [tiposLicencias] = useState([
    { label: 'Piloto de planeador', value: 'Piloto de planeador' },
    { label: 'Piloto privado', value: 'Piloto privado' },
    { label: 'Piloto comercial', value: 'Piloto comercial' },
    { label: 'Piloto de transporte de línea aérea', value: 'Piloto de transporte de línea aérea' },
    { label: 'Instructor de vuelo', value: 'Instructor de vuelo' },
    { label: 'Piloto de ultraligero', value: 'Piloto de ultraligero' }
  ]);

  const [ aplicaTarifa, setAplicaTarifa ] = useState(false);

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


  const fetchData = async () => {
    try {
      const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
      setUsuario(usuarioResponse[0]);
      setAplicaTarifa(usuario.tarifa_especial === 1);
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
  
  useEffect(() => {
    fetchData();
  }, [usuarioId]);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Cambia el estado `editado` a true cuando se detecte el primer cambio.
    if (!editado) setEditado(true);
};



const validarFormulario = () => {
  const camposFaltantes = [];

  if (!formData.Telefono) camposFaltantes.push("Teléfono");
  if (!formData.Dni) camposFaltantes.push("DNI");
  if (!formData.Localidad) camposFaltantes.push("Localidad");
  if (!formData.Direccion) camposFaltantes.push("Dirección");
  if (!formData.FechaNacimiento) camposFaltantes.push("Fecha de Nacimiento");
  if (!formData.FechaVencCMA) camposFaltantes.push("Fecha de Vencimiento CMA");
  if (!formData.CantHorasVuelo) camposFaltantes.push("Cantidad de Horas de Vuelo");
  if (!formData.CantAterrizajes) camposFaltantes.push("Cantidad de Aterrizajes");

  if (camposFaltantes.length > 0) {
    toast.warning(`Completa los siguientes campos: ${camposFaltantes.join(", ")}`);
    return false;
  }
  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  try {
    await actualizarDatosDelUsuario(usuarioId, formData);
    toast.success("Datos actualizados correctamente");

    // Vuelve a cargar los datos del usuario sin recargar la página
    await fetchData();
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    toast.error("Error al actualizar datos");
  }
};




  const formatFecha = (rowData) => {
    // Extrae solo la fecha de 'fecha_vigencia' (sin hora)
    const fecha = new Date(rowData.fecha_vigencia).toLocaleDateString();
    return fecha;
  };

  const calcularEstadoLicencia = (rowData) => {
    const fechaVencimiento = new Date(rowData.fecha_vigencia);
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
        licencias={usuario.codigos_licencias || ["No posee licencias"]}
      />

    <UploadImage />

    {role.includes('Instructor') && (
        
        <div className='info-adicional'>
          <h3>Información adicional:</h3>
          <div> </div>
          <div className={"indicador-tarifa-especial"}>
            <FaDollarSign/> Tarifa especial: <div className={`${aplicaTarifa ? 'aplica' : 'no-aplica'}`}> {aplicaTarifa ? 'Aplica' : 'No aplica'} </div>
          </div>
        </div>
    )}

      <form className="edit-form" onSubmit={handleSubmit}>
        <h2>{editado ? "Editar información:" : "Ingresar información:"}</h2>
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
          <button className="guardar" type="submit">Guardar Cambios</button>
        </div>
      </form>

      <section className="licencias-section">
        <h3>Licencias</h3>
        <DataTable 
          value={licencias} 
          style={{ width: '100%' }} >
          <Column field="codigos_licencias" header="Codigos de licencias"></Column>
          <Column field="descripcion" header="Descripcion"></Column>
          <Column field="fecha_vigencia" header="Fecha de otorgamiento" body={formatFecha} /> 
          {/* <Column header="Estado" body={calcularEstadoLicencia} /> */}
        </DataTable>
        <Button className="actualizar" label="Actualizar licencias" icon="pi pi-refresh" id="actualizar-licencias" onClick={() => setLicenciaDialog(true)} />
      
      </section>
      
      <Dialog
        className='actualizarLicenciaDialog'
        header="Actualizar Licencia"
        visible={licenciaDialog}
        onHide={() => setLicenciaDialog(false)}
        style={{ width: 'min-content', minwidth: '450px' }}
        footer={
          <>
            <Button  label="Cancelar" icon="pi pi-times" onClick={() => setLicenciaDialog(false)} className="p-button-secondary gestor-btn-cancelar" />
            <Button className="gestor-btn-confirmar" label="Actualizar" icon="pi pi-check" onClick={handleLicenciaUpdate} />
          </>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
          <label style={{  fontWeight: 'bold'}} htmlFor="tipoLicencia" >Tipo de licencia</label>
          <Dropdown
              id="tipoLicencia"
              value={selectedLicencia}
              options={tiposLicencias}
              onChange={(e) => setSelectedLicencia(e.value)}
              placeholder="Seleccione una licencia"
              style={{ width: '100%', height:'45px' }} // Cambia el valor según lo necesites
            />
          </div>
          <div className="p-field">
            <label htmlFor="fechaVencimiento">Fecha de inicio de vigencia</label>
            <Calendar
              id="fechaVencimiento"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.value)}
              showIcon
              dateFormat="dd-mm-yy"
              style={{ width: '400px' }}
              placeholder='-'
            />
          </div>
        </div>
      </Dialog>

      </div>
  );
}

export default AsociadoPerfil;