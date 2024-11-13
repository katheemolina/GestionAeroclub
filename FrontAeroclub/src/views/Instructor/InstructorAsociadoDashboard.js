import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import "./Styles/AsociadoDashboards.css"
import { useLocation } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

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


function InstructorAsociadoDashboard({ idUsuario = 1 }) { // Establecer idUsuario para traer su informacion
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [horasVoladas, setHorasVoladas] = useState(0);
  const [cma, setCma] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [data, setData] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Avión', accessor: 'matricula_aeronave' },
    { header: 'Último Vuelo', accessor: 'fecha_vuelo' },
    { header: 'Adaptación', accessor: 'Adaptacion' }
  ];

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

  if (loading) {
    return <div className="background"> 
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <ProgressSpinner 
        style={{width: '70px', height: '70px'}}
        strokeWidth="5"
        strokeColor="red"
        /> 
      </div>
    </div>;
  }
  return (
    <div className="background">
      <header className="header">
        <h1>{`${nombre} ${apellido}`}</h1>
      </header>

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
        <TableComponent columns={columns} data={data} />
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