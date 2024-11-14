import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import "./Styles/AsociadoDashboards.css"
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css'
import PantallaCarga from '../../components/PantallaCarga';

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
import { useUser } from '../../context/UserContext';


function Dashboard() { // Establecer idUsuario para traer su informacion
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [horasVoladas, setHorasVoladas] = useState(0);
  const [cma, setCma] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [data, setData] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
        const usuario = usuarioResponse[0]; // Accedemos al primer objeto
        setNombre(usuario.nombre);
        setApellido(usuario.apellido);
        
        // Obtener saldo
        const saldoResponse = await obtenerSaldoCuentaCorrientePorUsuario(usuarioId);
        const saldoData = saldoResponse[0]; // Accedemos al primer objeto
        setSaldo(saldoData.Saldo);
        
        // Obtener horas voladas
        const horasResponse = await horasVoladasPorUsuario(usuarioId);
        const horasData = horasResponse[0]; // Accedemos al primer objeto
        setHorasVoladas(horasData.TotalHoras);
        
        // Obtener estado del CMA
        const cmaResponse = await obtenerEstadoCMA(usuarioId);
        const cmaData = cmaResponse[0]; // Accedemos al primer objeto
        setCma(cmaData.estado);
        setFechaVencimiento(cmaData.fecha_vencimiento_cma);
        
        // Obtener últimos vuelos
        const vuelosResponse = await ultimosVuelosPorUsuario(usuarioId);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

        // Obtener licencias
        const licenciasResponse = await obtenerLicenciasPorUsuario(usuarioId);
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
  }, [usuarioId]);


  const cmaClass = cma === 'Vigente' ? 'cma-vigente' : 'cma-no-vigente';

  if (loading) {
    return <PantallaCarga/>
  }
  return (
    <div className="background">
      <header className="header">
        <h1>{`${nombre} ${apellido}`}</h1>
      </header>

      <section className="stats-section">
      <Link to="/asociado/cuenta-corriente" style={{ textDecoration: 'none', flex: 1 }}>
        <div className="stat-box">
          <h3>Saldo</h3>
          <p>${saldo}</p>
        </div>
      </Link>
      <Link to="/asociado/libro-vuelo" style={{ textDecoration: 'none', flex: 1 }}>
        <div className="stat-box">
          <h3>Horas Voladas</h3>
          <p>{horasVoladas}</p>
        </div>
      </Link>
    </section>

      <section className="stats-section">
      <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
        <div className={`stat-box ${cmaClass}`}>
          <h3>CMA</h3>
          <p>{cma}</p>
        </div>
        </Link>
        <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
        <div className="stat-box">
          <h3>CMA - Fecha de vencimiento</h3>
          <p>{fechaVencimiento}</p>
        </div>
        </Link>
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
          <Column field="Adaptacion" header="Adaptación" sortable></Column>
        </DataTable>
      </section>

      <section className="licencias-section">
        <h3>Licencias</h3>
        <ul>
          {licencias.map((licencia, index) => (
            <li key={index}>{`${licencia.codigo} - ${licencia.descripcion}`}</li>
          ))}
        </ul>
        <div className="button-container">
        <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
          <button type="submit">Editar licencias</button></Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;