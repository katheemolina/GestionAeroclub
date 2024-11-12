import React, { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent';

import "./Styles/AsociadoDashboards.css"
import { useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css';

//importo servicios
import {
  obtenerDatosDelUsuario,
  obtenerEstadoCMA,
  obtenerLicenciasPorUsuario
} from '../../services/usuariosApi';

import {
  obtenerSaldoCuentaCorrientePorUsuario
} from '../../services/movimientosApi';

import {
  horasVoladasPorUsuario,
  ultimosVuelosPorUsuario
} from '../../services/vuelosApi';


function GestorAsociadoDashboard() { // Establecer idUsuario para traer su informacion
  
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [horasVoladas, setHorasVoladas] = useState(0);
  const [cma, setCma] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [data, setData] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);


  const location = useLocation();  // Hook para obtener el estado de la navegación
  const { user } = location.state || {};  // Accedemos al estado pasad

  const idUsuario = user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const usuarioResponse = await obtenerDatosDelUsuario(idUsuario);
        const usuarioData = usuarioResponse[0]; 
        setUsuario(usuarioData);
        
        // Obtener saldo
        const saldoResponse = await obtenerSaldoCuentaCorrientePorUsuario(idUsuario);
        const saldoData = saldoResponse[0]; // Accedemos al primer objeto
        setSaldo(saldoData.Saldo);
        
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

  const cmaClass = cma === 'Vigente' ? 'cma-vigente' : 'cma-no-vigente';

  const fechaNacimientoFormateada = usuario?.fecha_nacimiento
  ? new Date(usuario.fecha_nacimiento).toLocaleDateString()
  : "Fecha no disponible";

  if (loading) {
    return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="background">
      <header className="header">
      <h1>{`${usuario?.nombre || ''} ${usuario?.apellido || ''}`}</h1>
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
          <h3>Saldo</h3>
          <p>${saldo}</p>
        </div>
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
        <DataTable value={data}>  
            <Column field="matricula_aeronave" header="Avión"></Column>
            <Column field="fecha_vuelo" header="Último vuelo"></Column>
            <Column field="Adaptacion" header="Adaptación"></Column>
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

export default GestorAsociadoDashboard;