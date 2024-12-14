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

        console.log("Saldo Response:", saldoResponse); // Aquí se registra el saldo.


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
          fechaVencimiento: cmaData.fecha_vencimiento_cma || "",
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
        <Link to="/asociado/cuenta-corriente" style={{ textDecoration: 'none', flex: 1 }}>
          <div className="stat-box">
            <h3>Saldo</h3>
            <p>${userData.saldo}</p>
          </div>
        </Link>
        <Link to="/asociado/libro-vuelo" style={{ textDecoration: 'none', flex: 1 }}>
          <div className="stat-box">
            <h3>Horas Voladas</h3>
            <p>{userData.horasVoladas}</p>
          </div>
        </Link>
      </section>

      <section className="stats-section">
        <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
          <div className={`stat-box ${cmaClass}`}>
            <h3>CMA</h3>
            <p>{userData.cma}</p>
          </div>
        </Link>
        <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
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
            <Column field="created_at" header="Último vuelo" sortable></Column>
            <Column field="tiempo" header="Tiempo" sortable></Column>
            <Column field="aterrizajes" header="Aterrizajes" sortable></Column>
            <Column field="adaptacion" header="Adaptación" sortable></Column>
          </DataTable>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </section>

      <section className="licencias-section">
        <h3>Licencias</h3>
        <ul>
          {userData.licencias.map((licencia, index) => (
            <li key={index}>{`${licencia.codigo} - ${licencia.descripcion}`}</li>
          ))}
        </ul>
        <div className="button-container">
          <Link to="/asociado/perfil" style={{ textDecoration: 'none', flex: 1 }}>
            <button type="submit">Editar licencias</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
