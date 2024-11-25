import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoDashboards.css"
import { useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import CardComponent from '../../components/CardComponent';

//importo servicios
import {
  obtenerDatosDelUsuario,
  obtenerEstadoCMA,
  obtenerLicenciasPorUsuario
} from '../../services/usuariosApi';

import {
  horasVoladasPorUsuario,
  ultimosVuelosPorUsuario
} from '../../services/vuelosApi';
import PantallaCarga from '../../components/PantallaCarga';


function InstructorAsociadoDashboard({ idUsuario = 1 }) { // Establecer idUsuario para traer su informacion
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [horasVoladas, setHorasVoladas] = useState(0);
  const [cma, setCma] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [data, setData] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();  // Hook para obtener el estado de la navegación
  const { user } = location.state || {};  // Accedemos al estado pasad

  idUsuario = user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const usuarioResponse = await obtenerDatosDelUsuario(idUsuario);
        const usuario = usuarioResponse[0]; // Accedemos al primer objeto
        setNombre(usuario.nombre);
        setApellido(usuario.apellido);
        const usuarioData = usuarioResponse[0]; 
        setUsuario(usuarioData);
        
        // Obtener horas voladas
        const horasResponse = await horasVoladasPorUsuario(idUsuario);
        const horasData = horasResponse[0]; // Accedemos al primer objeto
        setHorasVoladas(horasData.TotalHoras);
        
        // Obtener estado del CMA
        const cmaResponse = await obtenerEstadoCMA(idUsuario);
        const cmaData = cmaResponse[0]; // Accedemos al primer objeto
        setCma(cmaData.estado);
        setFechaVencimiento(cmaData.fecha_vencimiento_cma);
        
        // Obtener últimos vuelos
        const vuelosResponse = await ultimosVuelosPorUsuario(idUsuario);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

        // Obtener licencias
        const licenciasResponse = await obtenerLicenciasPorUsuario(idUsuario);
        const formattedLicencias = licenciasResponse.map(licencia => (
          { codigo: licencia.codigos_licencias, descripcion: licencia.descripcion }
        ));
        setLicencias(formattedLicencias); // Mapeamos para obtener solo la información necesaria

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [idUsuario]);

  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleBackClick = () => {
    navigate('/instructor/Asociados'); // Redirige a la ruta deseada
  };

  const cmaClass = cma === 'Vigente' ? 'cma-vigente' : 'cma-no-vigente';

  const fechaNacimientoFormateada = usuario?.fecha_nacimiento
  ? new Date(usuario.fecha_nacimiento).toLocaleDateString()
  : "Fecha no disponible";

  const adaptacionTemplate = (rowData) => (
    <span
      style={{
        fontWeight: "bold",
        color: rowData.Adaptacion === "Adaptado" ? "rgb(76, 175, 80)" : "rgb(169, 70, 70)",
      }}
    >
      {rowData.Adaptacion}
    </span>
  );

  if (loading) {
    return <PantallaCarga/>
  }
  return (
    <div className="background">
      <header className="header">
        {/* Botón Habilitar Usuario */}
      <Tooltip title="Ver Asociados">
        <IconButton 
          color="primary" 
          aria-label="Atras" 
          className="back-button" 
          onClick={handleBackClick} // Agrega el manejador de clics
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
        <h1>{`${nombre} ${apellido}`}</h1>
      </header>


      <CardComponent
        dni={usuario?.dni || "No disponible"}
        localidad={`📍 ${usuario?.localidad || "No disponible"}`}
        direccion={usuario?.direccion}
        telefono={`📞 ${usuario?.telefono || "No disponible"}`}
        email={`✉️ ${usuario?.email || "No disponible"}`} 
        fecha_nacimiento={`🎂 ${fechaNacimientoFormateada || "Fecha no disponible"}`}
      />

      <section className="stats-section">
        <div className="stat-box">
          <h3>Horas Voladas</h3>
          <p>{horasVoladas}</p>
        </div>
    </section>

      <section className="stats-section">
        <div className={`stat-box ${cmaClass}`}>
          <h3>CMA</h3>
          <p>{cma}</p>
        </div>
        <div className="stat-box">
          <h3>CMA - Fecha de vencimiento</h3>
          <p>{fechaVencimiento}</p>
        </div>
      </section>

      <section className="table-section">
        <h3>Registro de Vuelos</h3>
        <DataTable 
          value={data} 
          // paginator rows={4} 
          // rowsPerPageOptions={[10, 15, 25, 50]} 
          removableSort 
          scrollable
          scrollHeight="800px"
          >
          <Column field="matricula_aeronave" header="Avión" sortable ></Column>
          <Column field="fecha_vuelo" header="Último vuelo" sortable ></Column>
          <Column field="tiempo_vuelo" header="Tiempo" sortable ></Column>
          <Column field="aterrizajes" header="Aterrizajes" sortable></Column>
          <Column field="Adaptacion" header="Adaptación" body={adaptacionTemplate} sortable></Column>
        </DataTable>

      </section>

      <section className="licencias-section">
        <h3>Licencias</h3>
        <ul>
          {licencias.map((licencia, index) => (
            <li key={index}>{`${licencia.codigo} - ${licencia.descripcion}`}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default InstructorAsociadoDashboard;