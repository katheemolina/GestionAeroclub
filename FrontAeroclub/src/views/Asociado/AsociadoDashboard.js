import React, { useEffect, useState, useMemo } from 'react';
import "./Styles/AsociadoDashboards.css";
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css';
import PantallaCarga from '../../components/PantallaCarga';

import {obtenerDatosDelUsuario, obtenerEstadoCMA, obtenerLicenciasPorUsuario} from '../../services/usuariosApi';
import {obtenerSaldoCuentaCorrientePorUsuario} from '../../services/movimientosApi';
import {horasVoladasPorUsuario, ultimosVuelosPorUsuario} from '../../services/vuelosApi';
import { useUser } from '../../context/UserContext';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    saldo: 0,
    horasVoladas: 0,
    cma: '',
    fechaVencimiento: '',
    licencias: [],
    vuelos: []
  });

  const { usuarioId } = useUser();
  const rol = localStorage.getItem("role")?.toLowerCase(); // Para links 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usuarioResponse,
          saldoResponse,
          horasResponse,
          cmaResponse,
          vuelosResponse,
          licenciasResponse
        ] = await Promise.all([ //Aceleración de las llamadas API al ejecutarlas en paralelo.
          obtenerDatosDelUsuario(usuarioId),
          obtenerSaldoCuentaCorrientePorUsuario(usuarioId),
          horasVoladasPorUsuario(usuarioId),
          obtenerEstadoCMA(usuarioId),
          ultimosVuelosPorUsuario(usuarioId),
          obtenerLicenciasPorUsuario(usuarioId)
        ]);

        //console.log("Saldo Response:", saldoResponse); // Aquí se registra el saldo.

        //console.log("vuelos response: ", vuelosResponse)

        //console.log("Hora por usuario: ",horasResponse)

        const usuario = usuarioResponse?.[0] || {};
        const saldoData = saldoResponse?.[0] || {};
        const horasData = horasResponse?.[0] || {};
        const cmaData = cmaResponse?.[0] || {};
        const formattedLicencias = licenciasResponse?.map(lic => ({
          codigo: lic.codigos_licencias || "",
          descripcion: lic.descripcion || ""
        })) || [];

        setUserData({
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          saldo: saldoData.Saldo || 0,
          horasVoladas: horasData.TotalHoras || 0,
          cma: cmaData.estado || "Desconocido",
          fechaVencimiento: formatearFecha(cmaData.fecha_vencimiento_cma) || "",
          licencias: formattedLicencias,
          vuelos: vuelosResponse || []
        });

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [usuarioId]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}-${mes}-${año}`;
  };

  const formatearFechaUltimosVuelos = (fecha) => {
    if (!fecha) return "";
    const [fechaParte, horaParte] = fecha.split(" ");
    const [año, mes, dia] = fechaParte.split("-");
    const fechaFormateada = `${dia}-${mes}-${año}`;
    return `${fechaFormateada} ${horaParte}`;
  };
  
  const cmaClass = useMemo(() => userData.cma === 'Vigente' ? 'cma-vigente' : 'cma-no-vigente', [userData.cma]);

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <header className="header">
        <h1>{`${userData.nombre} ${userData.apellido}`}</h1>
      </header>

      <section className="stats-section">
        <Link to={`/${rol}/cuenta-corriente`} style={{ textDecoration: 'none', flex: 1 }}>
          <div className="stat-box">
            <h3>Saldo</h3>
            <p>${userData.saldo}</p>
          </div>
        </Link>
        <Link to={`/${rol}/libro-vuelo`} style={{ textDecoration: 'none', flex: 1 }}>
          <div className="stat-box">
            <h3>Horas Voladas</h3>
            <p>{userData.horasVoladas}</p>
          </div>
        </Link>
      </section>

      <section className="stats-section">
        <Link to={`/${rol}/perfil`} style={{ textDecoration: 'none', flex: 1 }}>
          <div className={`stat-box ${cmaClass}`}>
            <h3>CMA</h3>
            <p>{userData.cma}</p>
          </div>
        </Link>
        <Link to={`/${rol}/perfil`} style={{ textDecoration: 'none', flex: 1 }}>
          <div className="stat-box">
            <h3>CMA - Fecha de vencimiento</h3>
            <p>{userData.fechaVencimiento}</p>
          </div>
        </Link>
      </section>

      <section className="table-section">
        <h3>Registro de Vuelos</h3>
        {userData.vuelos.length > 0 ? (
          <DataTable
            value={userData.vuelos}
            removableSort
            scrollable
            scrollHeight="800px"
          >
            <Column field="matricula" header="Avión" sortable></Column>
            <Column field="created_at" header="Último vuelo" sortable   body={(rowData) => formatearFechaUltimosVuelos(rowData.created_at)}
            ></Column>
            <Column field="tiempo" header="Tiempo" sortable></Column>
            <Column field="aterrizajes" header="Aterrizajes" sortable></Column>
            <Column field="adaptacion" header="Adaptación" sortable></Column>
          </DataTable>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </section>

      <section className="licencias-section">
        <h3 style={{paddingBottom: '14px', borderBottom: '1px solid #DDD'}}>
          Licencias
        </h3>
        <ul>
          {userData.licencias.map((licencia, index) => (
            <li key={index}>{`${licencia.codigo} - ${licencia.descripcion}`}</li>
          ))}
        </ul>
        <div style={{paddingTop: '14px', borderTop: '1px solid #DDD'}}>
          <Link to={`/${rol}/perfil`} style={{ textDecoration: 'none', flex: 1 }}>
            <button className="gestor-btn-confirmar p-button" type="submit"><span className="p-button-label">Editar licencias</span></button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
