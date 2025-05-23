import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent'; 
import UploadImage from '../../components/UploadImage'; 
import "./Styles/AsociadoPerfil.css"
import { obtenerDatosDelUsuario,actualizarDatosDelUsuario ,obtenerLicenciasPorUsuario, actualizarLicencias, eliminarLicencia,   obtenerLicencias} from '../../services/usuariosApi';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';


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
  
  const [tablaTiposLicencias, setTablaTiposLicencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licencias, setLicencias] = useState([]); 
  const [licenciaDialog, setLicenciaDialog] = useState(false); // Controla si el dialog está abierto
  const [selectedLicencia, setSelectedLicencia] = useState(null); // Almacena la licencia seleccionada
  const [fechaVencimiento, setFechaVencimiento] = useState(null); // Almacena la fecha de vencimiento
  const [editado, setEditado] = useState(false);
  const [opcionesLicencias, setOpcionesLicencias] = useState([
  ]);
  const [editarDialog, setEditarDialog] = useState(false); // Controla visibilidad del dialog de editar
  const [eliminarDialog, setEliminarDialog] = useState(false); // Controla la visibilidad del dialog de eliminar
  const [ aplicaTarifa, setAplicaTarifa ] = useState(false);
  const [datosFila, setDatosFila] = useState();

  const fetchLicencias = async () => {
    try {
      const data = await obtenerLicenciasPorUsuario(usuarioId);
      //console.log("Licencias: ",data)
      setLicencias(data);
    } catch (error) {
      setLicencias([]);
      //console.error('Error fetching licencias:', error);
    }
  };

  const fetchTiposLicencias = async () => {
    try {
      const data = await obtenerLicencias();
      setTablaTiposLicencias(data);
    } catch (error) {
      console.error('Error al buscar los tipos de licencias de la BDD:'. error);
    }
  }

  const mapToOpcionesLicencias = (data) => {
    return data.map((item) => ({
      label: item.descripcion, // Assuming descripcion is the field you want to use for the label
      value: item.descripcion, // You can change this to another field if needed
    }));
  };

  useEffect(() => {
    fetchLicencias();
    setLoading(false);
    fetchTiposLicencias();
  }, []);

  useEffect(() => {
    if (tablaTiposLicencias.length > 0) {
      const mappedData = mapToOpcionesLicencias(tablaTiposLicencias);
      setOpcionesLicencias(mappedData); // Update opcionesLicencias state
    }
  }, [tablaTiposLicencias]);


  const handleLicenciaUpdate = async () => {

    if (!selectedLicencia || !fechaVencimiento) {
      toast.warning("Por favor, seleccione una licencia y una fecha de vencimiento.");
      return;
    }

    try {
      // Find the licencia object from tablaTiposLicencias that matches the selectedLicencia
      const licencia = tablaTiposLicencias.find((item) => item.descripcion === selectedLicencia);
      
      if (!licencia) {
        toast.error("Licencia no encontrada.");
        return;
      }

      const licenciaData = 
      {
        id_usuario: usuarioId, 
        id_licencia: licencia.id_licencia,  // Get the id_licencia from tablaTiposLicencias
        fecha_vigencia: fechaVencimiento.toISOString().split('T')[0],  // Format the fecha_vigencia as 'YYYY-MM-DD'
      };

      await actualizarLicencias(licenciaData); // Llamada a la API con los datos
      toast.success("Licencia actualizada correctamente.");
      setLicenciaDialog(false); // Cierra el diálogo después de la actualización
      setEditarDialog(false);
      fetchLicencias(); // Vuelve a cargar las licencias actualizadas
    } catch (error) {
      console.error("Error al actualizar licencia:", error);
      toast.error("Error al actualizar licencia.");
    }
  };

  const handleLicenciaDelete = async () => {
    try {

      const licencia = tablaTiposLicencias.find((item) => item.descripcion === selectedLicencia);

      if (!licencia) {
        toast.error("Licencia no encontrada.");
        return;
      }

      const licenciaData = 
      {
        id_usuario: usuarioId, 
        id_licencia: licencia.id_licencia,  // Get the id_licencia from tablaTiposLicencias
      };

      await eliminarLicencia(licenciaData);
      toast.success("Licencia eliminada correctamente.");
      setEliminarDialog(false);
      fetchLicencias();
    } catch (error) {
      console.error("Error al eliminar licencia:", error);
      toast.error("Error al eliminar licencia.");
    }
  }



  const fetchData = async () => {
    try {
      const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
      setUsuario(usuarioResponse[0]);
      setAplicaTarifa(
        usuarioResponse[0].tarifa_especial === 1 ? "Aplica" :
        usuarioResponse[0].tarifa_especial === 0 ? "No aplica" :
        "No definido"
      );
      
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
  if (!formData.CantHorasVuelo) camposFaltantes.push("Tiempo de vuelo");
  if (!formData.CantAterrizajes) camposFaltantes.push("Cantidad de Aterrizajes");

  if (camposFaltantes.length > 0) {
    toast.warning(`Completa los siguientes campos: ${camposFaltantes.join(", ")}`);
    return false;
  }
  return true;
};

const confirmDelete = (licencia) => {
  setSelectedLicencia(licencia);
  setEliminarDialog(true);
}

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  try {
    await actualizarDatosDelUsuario(usuarioId, formData);
    toast.success("Datos actualizados correctamente");
    

    setTimeout(() => {
      window.location.reload();
    }, 1500);


    // Vuelve a cargar los datos del usuario sin recargar la página
    await fetchData();
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    toast.error("Error al actualizar datos");
  }
};

const formatFecha = (rowData) => {
  const fecha = new Date(rowData.fecha_vigencia + 'T00:00:00'); // Forzar medianoche local
  return fecha.toLocaleDateString();
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

    {/* <UploadImage /> */}

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
              type="number"
              name="Dni"
              placeholder="DNI"
              value={formData.Dni}
              onChange={handleChange}
              min="1"
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
            Tiempo de Vuelo:
            <input
              type="number"
              name="CantHorasVuelo"
              placeholder="Horas de Vuelo"
              value={formData.CantHorasVuelo}
              onChange={handleChange}
              min="0"
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
              min="0"
            />
          </label>
        </div>
        <div style={{width:'100%', display:'flex', marginTop: '20px'}}>
          <button className=" gestor-btn-confirmar p-component" type="submit"><span className='p-button-label'>Guardar Cambios</span></button>
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
          <Column header="Acciones"
                  style={{width: '1px'}}
                  body={(rowData) => (
                    
                    <div style={{ display: 'flex', gap: '8px'}}>
                        <Tooltip title="Eliminar">
                            <IconButton color="primary" aria-label="delete" onClick={() => confirmDelete(rowData.descripcion)}>
                                 <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton color="primary" aria-label="edit" onClick={() => {setDatosFila(rowData); setSelectedLicencia(rowData.descripcion); setEditarDialog(true)}}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </div>)}
          ></Column>
          {/* <Column header="Estado" body={calcularEstadoLicencia} /> */}
        </DataTable>
        <Button className="gestor-btn-confirmar p-component" label="Agregar Licencia" icon="pi pi-refresh" id="actualizar-licencias" onClick={() => setLicenciaDialog(true)} />
      </section>
      
      <Dialog
        className='actualizarLicenciaDialog'
        header="Agregar Licencia"
        visible={licenciaDialog}
        onHide={() => setLicenciaDialog(false)}
        style={{ width: 'min-content', minwidth: '450px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
            <Button className="gestor-btn-cancelar" label="Cancelar" icon="pi pi-times" style={{marginRight: '10px'}} onClick={() => setLicenciaDialog(false)} />
            <Button className="p-button-secondary gestor-btn-confirmar" label="Agregar" icon="pi pi-check" style={{marginRight: '0'}}  onClick={handleLicenciaUpdate} />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
          <label style={{  fontWeight: 'bold'}} htmlFor="tipoLicencia" >Tipo de licencia</label>
          <Dropdown
              id="tipoLicencia"
              value={selectedLicencia}
              options={opcionesLicencias}
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
      
      
      <Dialog
        className='eliminarLicenciaDialog'
        visible={eliminarDialog}
        onHide={() => setEliminarDialog(false)}
        style={{ width: '450px'}}
        header="Eliminar Licencia"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
            <Button className="gestor-btn-cancelar" label="Cancelar" icon="pi pi-times" style={{marginRight: '10px'}} onClick={() => setEliminarDialog(false)}  />
            <Button className="p-button-secondary gestor-btn-confirmar" label="Eliminar" icon="pi pi-check" style={{marginRight: '0'}} onClick={() => handleLicenciaDelete()}/>  
          </div>
        }>
          <p>¿Está seguro de que desea eliminar esta licencia?</p>
      </Dialog>

      <Dialog
        className='editarLicenciaDialog'
        visible={editarDialog}
        onHide={() => setEditarDialog(false)}
        style={{ width: 'min-content', minwidth: '450px' }}
        header="Editar información de Licencia"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
            <Button className="p-button-secondary gestor-btn-cancelar" label="Cancelar" icon="pi pi-times" style={{marginRight: '10px'}} onClick={() => setEditarDialog(false)}  />
            <Button className="gestor-btn-confirmar" label="Confirmar" icon="pi pi-check" style={{marginRight: '0'}} onClick={() => {handleLicenciaUpdate()}} /> 
          </div>
        }>
          {datosFila && 
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="fechaVencimiento">Fecha de inicio de vigencia</label>
              <Calendar
                id="fechaVencimiento"
                value={datosFila}
                onChange={(e) => setFechaVencimiento(e.value)}
                showIcon
                dateFormat="dd-mm-yy"
                style={{ width: '400px' }}
                placeholder={formatFecha(datosFila)}
              />
            </div>
          </div>
          }
      </Dialog>

      </div>
  );
}

export default AsociadoPerfil;